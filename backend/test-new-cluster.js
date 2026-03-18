// bypass-dns-test.js
import mongoose from 'mongoose';

// Use direct connection WITHOUT SRV records
const MONGO_URI = 'mongodb://appuser:AppPassword123@ac-b0hlv98-shard-00-00.b0hlv98.mongodb.net:27017,ac-b0hlv98-shard-00-01.b0hlv98.mongodb.net:27017,ac-b0hlv98-shard-00-02.b0hlv98.mongodb.net:27017/deetech?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 Testing DIRECT connection (no DNS SRV)...');
console.log('Note: You need to find the actual shard URLs from MongoDB Atlas\n');

// Try to connect directly
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 20000,
})
.then(() => {
  console.log('✅ SUCCESS with direct connection!');
  console.log('Use this format in your .env (without mongodb+srv://)');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Failed:', err.message);
  
  console.log('\n🔧 Get the direct connection string:');
  console.log('1. In MongoDB Atlas, click "Connect" on your cluster');
  console.log('2. Click "Connect your application"');
  console.log('3. Look for "Connection String Only"');
  console.log('4. It should show the direct shard URLs');
  
  process.exit(1);
});