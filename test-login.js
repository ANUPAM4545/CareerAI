async function test() {
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Next-Action': 'c123', // Just a dummy to simulate action, actually we need the real action id.
      }
    });
    console.log(res.headers.get('set-cookie'));
  } catch(e) {
    console.log(e);
  }
}
test();
