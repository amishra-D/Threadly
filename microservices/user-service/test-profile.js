const mongoose = require('mongoose');
const Profile = require('./models/Profile');
require('dotenv').config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB");
    
    // Find any profile
    const p = await Profile.findOne();
    console.log("Found profile:", p);
    
    if (p) {
        // Try finding by authId as a string, mimicking req.user.id
        const authIdStr = p.authId.toString();
        const found = await Profile.findOne({ authId: authIdStr });
        console.log("Found by string authId:", !!found);
    }
    
    process.exit(0);
}
test();
