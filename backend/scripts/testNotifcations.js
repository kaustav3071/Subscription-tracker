import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../db/connect.js';
import User from '../models/User.model.js';
import Subscription from '../models/subscription.model.js';
import { notifyRenewalReminder, notifySpendingAlert } from '../services/notification.service.js';

// Load .env from backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Check for --force flag to bypass preferences
const forceMode = process.argv.includes('--force');

async function testNotifications() {
  console.log('🔧 MONGO_URI:', process.env.MONGO_URL ? 'Found' : 'NOT FOUND');
  if (forceMode) {
    console.log('⚠️  FORCE MODE: Ignoring user preferences for testing');
  }
  
  await connectDB();
  console.log('🌐 Connected to DB');
  
  // Get a test user (change email to your test user)
  const testEmail = 'jeetdas3071@gmail.com';
  const user = await User.findOne({ email: testEmail });
  
  if (!user) {
    console.log('❌ User not found:', testEmail);
    process.exit(1);
  }
  
  console.log('✅ Found user:', user.name, user.email);
  console.log('📧 Notification Prefs:', user.notifications);

  const prefs = user.notifications || {};

  // Test 1: Renewal Reminder
  console.log('\n--- Testing Renewal Reminder ---');
  
  if (!forceMode && prefs.renewalReminders === false) {
    console.log('⏭️  Skipped: User has disabled renewal reminders');
  } else {
    // Find subscription with upcoming nextChargeDate
    const testSub = await Subscription.findOne({ user: user._id, status: 'active' });
    
    if (testSub) {
      console.log('📌 Subscription:', testSub.name);
      console.log('   Billing Cycle:', testSub.billingCycle);
      console.log('   Next Charge:', testSub.nextChargeDate ? new Date(testSub.nextChargeDate).toLocaleDateString() : 'Not set');
      console.log('   Last Reminder Sent:', testSub.lastReminderSent ? new Date(testSub.lastReminderSent).toLocaleString() : 'Never');
      
      await notifyRenewalReminder(user, testSub);
      console.log('✅ Renewal reminder email sent!');
      
      // Update lastReminderSent to simulate scheduler behavior
      if (forceMode) {
        await Subscription.updateOne({ _id: testSub._id }, { lastReminderSent: new Date() });
        console.log('📝 Updated lastReminderSent timestamp');
      }
    } else {
      console.log('⚠️ No active subscription found for testing');
    }
  }

  // Test 2: Spending Alert
  console.log('\n--- Testing Spending Alert ---');
  
  if (!forceMode && prefs.spendingAlerts === false) {
    console.log('⏭️  Skipped: User has disabled spending alerts');
  } else {
    const threshold = prefs.spendingThreshold || 5000;
    const currency = prefs.currency || 'INR';
    const lastAlertSent = prefs.lastSpendingAlertSent;
    
    console.log('   Threshold:', threshold, currency);
    console.log('   Last Alert Sent:', lastAlertSent ? new Date(lastAlertSent).toLocaleString() : 'Never');
    
    // Calculate actual spending
    const userSubs = await Subscription.aggregate([
      { $match: { user: user._id, status: 'active' } },
      { $group: { _id: '$user', total: { $sum: '$amount' } } },
    ]);
    const actualTotal = userSubs.length > 0 ? userSubs[0].total : 0;
    console.log('   Actual Monthly Spend:', actualTotal, currency);
    
    const testSpending = threshold + 1000; // Exceed threshold for testing
    
    // notifySpendingAlert expects: (user, period, total, threshold, currency)
    await notifySpendingAlert(user, 'monthly', testSpending, threshold, currency);
    console.log('✅ Spending alert email sent!');
  }

  console.log('\n🎉 Test complete! Check your email inbox.');
  process.exit(0);
}

testNotifications().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});