// test-now.js
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://deetech:QK8wa7uLRcUOUTLM@deetech.e47yovh.mongodb.net/deetech?retryWrites=true&w=majority&appName=Deetech';

console.log('🔄 Testing MongoDB connection after IP whitelist...');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ SUCCESS! Connected to MongoDB Atlas');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  console.log('📍 Host:', mongoose.connection.host);
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ Still failing:', err.message);
  console.log('\n🔧 If still failing, try:');
  console.log('1. Wait longer (changes can take up to 5 minutes)');
  console.log('2. Check if user "deetech" exists in Database Access');
  console.log('3. Try from a different network (mobile hotspot)');
  process.exit(1);
});