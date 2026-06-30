const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Removed duplicate connection call
// MongoDB Atlas Configuration
const MONGODB_URI = 'mongodb+srv://sachinku1259_db_user:Va9AEm8sLgW0mgG0@cluster0.kgokl91.mongodb.net/solo_penal?retryWrites=true&w=majority';

// Models
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expiry: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// Initial Admin Setup
async function initAdmin() {
    try {
        console.log('Syncing Admin Account...');
        await Admin.findOneAndUpdate(
            { username: 'sagar' },
            { password: 'Vivek321' },
            { upsert: true, new: true }
        );
        console.log('✅ Admin Sync Complete: sagar / Vivek321');
    } catch (err) {
        console.error('❌ Admin Init Error:', err.message);
    }
}

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    initAdmin();
})
.catch(err => console.error('❌ DB Error:', err.message));

// --- ADMIN API ---

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    console.log('Login attempt for:', req.body.username);
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username, password });
        if (admin) {
            console.log('✅ Admin login successful');
            res.json({ success: true, token: 'secret-admin-token' });
        } else {
            console.log('❌ Invalid credentials');
            res.status(401).json({ success: false, error: 'Invalid Admin Credentials' });
        }
    } catch (err) {
        console.error('Login API Error:', err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Create User
app.post('/api/admin/create-user', async (req, res) => {
    const { userId, password, days } = req.body;
    try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(days));
        await User.create({ userId, password, expiry: expiryDate });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'User already exists or data error' });
    }
});

// Get Users
app.get('/api/admin/users', async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
});

// Delete User
app.delete('/api/admin/delete-user/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// --- USER API ---

app.post('/api/login', async (req, res) => {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId, password });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid ID or Password' });
    if (new Date() > user.expiry) return res.status(403).json({ success: false, error: 'Account Expired!' });
    res.json({ success: true, user });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
