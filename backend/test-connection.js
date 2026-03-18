// test-connection.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 Current directory:', __dirname);
console.log('📄 .env file location:', path.join(__dirname, '.env'));

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('\n🔍 Checking environment variables:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.MONGO_URI) {
  console.log('\n🔗 Testing MongoDB connection...');
  console.log('MongoDB URI starts with:', process.env.MONGO_URI.substring(0, 40) + '...');
  
  // Test the connection string format
  if (!process.env.MONGO_URI.startsWith('mongodb+srv://')) {
    console.error('❌ ERROR: MONGO_URI must start with mongodb+srv://');
  } else {
    console.log('✅ URI format looks correct');
  }
} else {
  console.error('❌ ERROR: MONGO_URI is not defined in .env file');
}