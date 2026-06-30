const mongoose = require('mongoose');

// --- MONGODB ATLAS CONFIGURATION ---
// Using your verified connection string
const MONGODB_URI = 'mongodb+srv://sachinku1259_db_user:Va9AEm8sLgW0mgG0@cluster0.kgokl91.mongodb.net/solo_penal?retryWrites=true&w=majority';

async function testAtlasConnection() {
    console.log('Connecting to MongoDB Atlas...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('\n✅ SUCCESS: Your Cloud Database is connected!');
        console.log('Database Name: solo_penal');
        console.log('Status: Online & Secure');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ FAILED: Could not connect to Atlas.');
        console.error('Reason:', err.message);
        console.log('\n--- TROUBLESHOOTING TIPS ---');
        console.log('1. Check if <db_password> is correct (not your login password).');
        console.log('2. Check if <cluster_url> is correct.');
        console.log('3. Go to "Network Access" in Atlas and click "ADD IP ADDRESS" -> "ALLOW ACCESS FROM ANYWHERE".');
        process.exit(1);
    }
}

testAtlasConnection();
