import http from 'http';

export async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        if (tabs.length > 0) resolve(tabs[0].webSocketDebuggerUrl);
        else reject(new Error('No tabs'));
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
          returnByValue: true
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

async function run() {
  const code = `
    (() => {
      const header = document.querySelector('header.rounded-3xl');
      const results = [];
      if (header) {
        header.querySelectorAll('*').forEach(el => {
          if (el.scrollWidth > 294) {
            results.push({
              tag: el.tagName,
              cls: (el.className || '').slice(0, 50),
              scrollW: el.scrollWidth,
              clientW: el.clientWidth,
              text: (el.innerText || '').slice(0, 45)
            });
          }
        });
      }
      return results;
    })()
  `;
  const res = await evalInWebview(code);
  console.log(JSON.stringify(res, null, 2));
}

run().catch(console.error);
