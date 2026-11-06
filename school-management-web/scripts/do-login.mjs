import { evalInWebview } from './phone-portal.mjs';

async function testLogin() {
  const targetUser = process.argv[2] || 'admin';
  const targetPass = process.argv[3] || 'Admin123!';
  console.log(`Attempting login as ${targetUser}...`);
  const check = await evalInWebview(`
    (() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
        type: i.type,
        name: i.name,
        placeholder: i.placeholder,
        id: i.id
      }));
      const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
        type: b.type,
        text: b.innerText
      }));
      return { inputs, buttons, url: window.location.href };
    })()
  `);
  console.log('Login form elements:', JSON.stringify(check, null, 2));

  // Perform login
  const result = await evalInWebview(`
    (async () => {
      const u = document.querySelectorAll('input')[0];
      const p = document.querySelectorAll('input')[1];
      const submitBtn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Đăng nhập'));
      if (u && p && submitBtn) {
        // React synthetic event triggers
        const setterU = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setterU.call(u, "${targetUser}");
        u.dispatchEvent(new Event('input', { bubbles: true }));

        const setterP = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setterP.call(p, "${targetPass}");
        p.dispatchEvent(new Event('input', { bubbles: true }));

        await new Promise(r => setTimeout(r, 400));
        submitBtn.click();
        return { status: 'submitted', uVal: u.value, pVal: p.value ? 'has_val' : 'empty' };
      }
      return { status: 'failed_to_find_elements' };
    })()
  `);
  console.log('Submit result:', result);
}

testLogin().catch(console.error);
