document.getElementById('btn-login').addEventListener('click', async () => {
    const userId = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('login-error');

    errorEl.textContent = "";

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });
        const data = await response.json();

        if (data.success) {
            showDashboard(data.user);
        } else {
            errorEl.textContent = data.error;
        }
    } catch (err) {
        errorEl.textContent = "Server Connection Error";
    }
});

function showDashboard(user) {
    document.querySelector('.login-card').style.display = 'none';
    document.querySelector('header p').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    document.getElementById('display-username').textContent = user.userId;
    document.getElementById('expiry-time').textContent = new Date(user.expiry).toLocaleString();

    // Simulate ping
    setInterval(() => {
        const ping = Math.floor(Math.random() * 20) + 15;
        document.getElementById('ping').textContent = ping + "ms";
    }, 3000);
}

document.getElementById('btn-logout').addEventListener('click', () => {
    window.location.reload();
});

// Feature toggles
const toggles = [
    'esp-toggle',
    'aimbot-toggle',
    'headshot-toggle',
    'recoil-toggle',
    'speed-toggle',
    'ghost-toggle',
    'antenna-toggle',
    'medkit-toggle'
];
toggles.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', (e) => {
        console.log(\`\${id} set to \${e.target.checked}\`);
    });
});
