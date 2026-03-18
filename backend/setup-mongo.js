// setup-mongo.js
import fs from 'fs';
import path from 'path';

console.log('🚀 SETTING UP MONGODB CONNECTION\n');

const envPath = path.resolve(process.cwd(), '.env');

// Option 1: MongoDB Atlas (if it works)
const atlasConfig = `# MongoDB Atlas NEW CLUSTER
MONGO_URI=mongodb+srv://appuser:AppPassword123@cluster0.b0hlv98.mongodb.net/deetech?retryWrites=true&w=majority&appName=Cluster0`;

// Option 2: Local MongoDB (guaranteed to work)
const localConfig = `# Local MongoDB (RECOMMENDED for development)
MONGO_URI=mongodb://localhost:27017/deetech`;

// Read current .env
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  envContent = `PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=

# JWT
JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=7d

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cartadaniel01@gmail.com
SMTP_PASS=hksx nbxj qirz nodk
ADMIN_EMAIL=cartadaniel01@gmail.com`;
}

console.log('🤔 Choose database option:');
console.log('1. MongoDB Atlas (Cloud) - may have network issues');
console.log('2. Local MongoDB - guaranteed to work\n');

// Ask user
console.log('🎯 RECOMMENDATION: Choose Local MongoDB for now');
console.log('   You can switch to Atlas later for production\n');

// Default to Local MongoDB (recommended)
const useLocal = true;

if (useLocal) {
  console.log('✅ Setting up LOCAL MongoDB...');
  
  // Update .env with local MongoDB
  const updatedEnv = envContent.replace(
    /MONGO_URI=.*/,
    'MONGO_URI=mongodb://localhost:27017/deetech'
  );
  
  fs.writeFileSync(envPath, updatedEnv);
  console.log('✅ Updated .env with LOCAL MongoDB');
  
  console.log('\n🔧 Next steps:');
  console.log('1. Install MongoDB locally:');
  console.log('   https://www.mongodb.com/try/download/community');
  console.log('2. Run as Administrator: net start MongoDB');
  console.log('3. Run: npm start');
  
} else {
  console.log('✅ Setting up MongoDB Atlas...');
  
  const updatedEnv = envContent.replace(
    /MONGO_URI=.*/,
    'MONGO_URI=mongodb+srv://appuser:AppPassword123@cluster0.b0hlv98.mongodb.net/deetech?retryWrites=true&w=majority&appName=Cluster0'
  );
  
  fs.writeFileSync(envPath, updatedEnv);
  console.log('✅ Updated .env with MongoDB Atlas');
  
  console.log('\n⚠️  Before running, make sure:');
  console.log('1. IP is whitelisted (0.0.0.0/0) in Network Access');
  console.log('2. User "appuser" exists with password "AppPassword123"');
  console.log('3. Wait 5 minutes after whitelisting');
  console.log('4. Run: npm start');
}

console.log('\n📁 Your .env file is ready at:', envPath);