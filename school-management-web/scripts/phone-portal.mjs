import http from 'http';

export async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const tabs = JSON.parse(data);
          const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
          if (pageTab) resolve(pageTab.webSocketDebuggerUrl);
          else reject(new Error('No tabs'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

export async function evalInWebview(code) {
  const wsUrl = await getWsUrl();
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: code,
          returnByValue: true,
          awaitPromise: true,
        }
      }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 1) {
        ws.close();
        if (data.result.exceptionDetails) {
          reject(data.result.exceptionDetails);
        } else {
          resolve(data.result.result.value);
        }
      }
    };
    ws.onerror = reject;
  });
}

async function main() {
  const action = process.argv[2] || 'check';

  if (action === 'check') {
    const info = await evalInWebview(`
      (() => {
        return {
          url: window.location.href,
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          bodyScrollW: document.body.scrollWidth,
          docScrollW: document.documentElement.scrollWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth
        };
      })()
    `);
    console.log('Page info:', JSON.stringify(info, null, 2));

    // Find any overflowing elements
    const overflows = await evalInWebview(`
      (() => {
        const docW = window.innerWidth;
        const bad = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.scrollWidth > docW + 2) {
            bad.push({
              tag: el.tagName,
              cls: (el.className || '').toString().slice(0, 60),
              scrollW: el.scrollWidth,
              clientW: el.clientWidth,
              text: (el.innerText || '').slice(0, 40).replace(/\\n/g, ' ')
            });
          }
        });
        return bad.slice(0, 15);
      })()
    `);
    console.log('Overflowing elements (> innerWidth):', JSON.stringify(overflows, null, 2));
  } else if (action === 'eval') {
    const expr = process.argv[3];
    const val = await evalInWebview(expr);
    console.log('Eval result:', val);
  } else if (action === 'height') {
    const h = await evalInWebview('document.body.scrollHeight');
    console.log('Document scrollHeight:', h, 'px (window.innerHeight:', await evalInWebview('window.innerHeight'), 'px)');
  } else if (action === 'scroll') {
    const y = parseInt(process.argv[3] || '400', 10);
    await evalInWebview(`window.scrollBy(0, ${y})`);
    console.log('Scrolled by', y);
  } else if (action === 'inspect-deep') {
    const details = await evalInWebview(`
      (() => {
        const root = document.querySelector('div.from-orange-500');
        if (!root) return 'Not found';
        const bad = [];
        root.querySelectorAll('*').forEach(el => {
          if (el.scrollWidth > 304 || el.offsetWidth > 304) {
            bad.push({
              tag: el.tagName,
              cls: (el.className || '').toString().slice(0, 50),
              scrollW: el.scrollWidth,
              offsetW: el.offsetWidth,
              text: (el.innerText || '').slice(0, 30).replace(/\\n/g, ' ')
            });
          }
        });
        return bad;
      })()
    `);
    console.log('Deep details:', JSON.stringify(details, null, 2));
  } else if (action === 'reload') {
    await evalInWebview('window.location.reload()');
    console.log('Page reloaded.');
  } else if (action === 'navigate') {
    const targetUrl = process.argv[3];
    await evalInWebview(`window.location.href = "${targetUrl}"`);
    console.log('Navigated to', targetUrl);
  } else if (action === 'login') {
    const username = process.argv[3] || 'phuhuynh301';
    const password = process.argv[4] || 'Admin123!';
    console.log('Logging in as ' + username + '...');
    const res = await evalInWebview(`
      (async () => {
        window.location.href = '/login';
        await new Promise(r => setTimeout(r, 1500));
        const userInp = document.querySelector('input[type="text"], input[name="username"], input[autocomplete="username"]');
        const passInp = document.querySelector('input[type="password"]');
        const btn = document.querySelector('button[type="submit"]');
        if (userInp && passInp && btn) {
          userInp.value = "${username}";
          userInp.dispatchEvent(new Event('input', { bubbles: true }));
          passInp.value = "${password}";
          passInp.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(r => setTimeout(r, 300));
          btn.click();
          return { status: 'submitted' };
        }
        return { status: 'inputs_not_found', currentUrl: window.location.href };
      })()
    `);
    console.log('Login result:', res);
  } else if (action === 'logout') {
    console.log('Logging out...');
    await evalInWebview(`
      (() => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach(c => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = '/login';
      })()
    `);
    console.log('Logged out.');
  }
}

main().catch(console.error);
