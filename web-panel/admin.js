async function createUser() {
    const userId = document.getElementById('new-userid').value;
    const password = document.getElementById('new-password').value;
    const days = document.getElementById('expiry-days').value;

    if (!userId || !password) {
        alert("Please fill all fields");
        return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin_login.html';
        return;
    }

    try {
        const response = await fetch('/api/admin/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ userId, password, days })
        });
        const data = await response.json();
        if (data.success) {
            alert("New Access Key Generated Successfully!");
            loadUsers();
            document.getElementById('new-userid').value = '';
            document.getElementById('new-password').value = '';
        } else {
            alert("Error: " + data.error);
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadUsers() {
    const container = document.getElementById('users-container');
    container.innerHTML = "<div class='card'>Loading database...</div>";

    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();

        container.innerHTML = "";
        if (users.length === 0) {
            container.innerHTML = "<div class='card'>No active users found.</div>";
            return;
        }

        users.forEach(user => {
            const expiryDate = new Date(user.expiry);
            const isExpired = expiryDate < new Date();

            const card = document.createElement('div');
            card.className = 'card user-card';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <h4><i class="fas fa-id-badge"></i> ${user.userId}</h4>
                        <p><i class="fas fa-lock"></i> PW: <code>${user.password}</code></p>
                        <p><i class="fas fa-clock"></i> Exp: ${expiryDate.toLocaleString()}</p>
                        <p class="${isExpired ? 'status-expired' : 'status-active'}">
                            <i class="fas fa-info-circle"></i> ${isExpired ? 'EXPIRED' : 'SUBSCRIPTION ACTIVE'}
                        </p>
                    </div>
                    <button onclick="deleteUser('${user._id}')" class="btn-secondary" style="padding: 5px 10px; border-color: #ff0055; color: #ff0055;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = "<div class='card status-expired'>Error connecting to server</div>";
    }
}

async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
        await fetch(\`/api/admin/delete-user/\${id}\`, {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.getItem('adminToken') }
        });
        loadUsers();
    } catch (err) {
        console.error(err);
    }
}

// Initial Load
window.onload = () => {
    if (localStorage.getItem('adminToken')) {
        loadUsers();
    }
};
