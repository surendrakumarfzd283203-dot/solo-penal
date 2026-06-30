document.getElementById('btn-login').addEventListener('click', async function() {
    var userId = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var errorEl = document.getElementById('login-error');
    errorEl.textContent = "";
    try {
        var response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, password: password })
        });
        var data = await response.json();
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
    setInterval(function() {
        var ping = Math.floor(Math.random() * 20) + 15;
        document.getElementById('ping').textContent = ping + "ms";
    }, 3000);
}

document.getElementById('btn-logout').addEventListener('click', function() {
    window.location.reload();
});

var toggles = [
    'esp-toggle',
    'aimbot-toggle',
    'headshot-toggle',
    'recoil-toggle',
    'speed-toggle',
    'ghost-toggle',
    'antenna-toggle',
    'medkit-toggle'
];

toggles.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
        el.addEventListener('change', function(e) {
            console.log(id + " set to " + e.target.checked);
        });
    }
});
