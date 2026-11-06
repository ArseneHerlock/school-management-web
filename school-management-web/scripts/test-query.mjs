import { evalInWebview } from './inspect-webview.mjs';

async function main() {
  const res = await evalInWebview(`
    (async () => {
      const resp = await fetch('/api/backend/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserName: 'phuhuynh301', Password: 'Admin123!' })
      });
      const data = await resp.json();
      if (data.accessToken) {
        localStorage.setItem('school_access_token', data.accessToken);
        window.location.href = '/parent';
        return 'Logged in as phuhuynh301, navigated to /parent';
      }
      return 'Login failed: ' + JSON.stringify(data);
    })()
  `);
  console.log(res);
}

main().catch(console.error);
