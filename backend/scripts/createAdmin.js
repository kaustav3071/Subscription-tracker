import dotenv from 'dotenv'
import { connectDB } from '../db/connect.js'
import User from '../models/User.model.js'

dotenv.config()

async function createAdmin() {
    await connectDB();

    const admin_email = process.env.ADMIN_EMAIL;
    const admin_password = process.env.ADMIN_PASSWORD;
    
    const exists = await User.findOne({email:admin_email});
    if (exists){
        exists.role='admin';
        exists.isVerified = true;
        await exists.save();
        console.log('✓ Existing user promoted to admin');
    }
    else{
        await User.create({
            email:admin_email,
            password: admin_password,
            name:"ADMIN;",
            isVerified:true,
            role:"admin"
        });
        console.log('✓ New admin user created');
    }
    process.exit(0);
}

createAdmin().catch((err) => {
    console.error('Error creating admin user:', err);
    process.exit(1);
});