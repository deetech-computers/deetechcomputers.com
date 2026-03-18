// get-connection.js
console.log('📋 FOLLOW THESE EXACT STEPS:\n');

console.log('1. In MongoDB Atlas, click "Drivers"');
console.log('2. Select: Node.js → 4.1 or later');
console.log('3. Copy the connection string shown');
console.log('4. It should look like:');
console.log('   mongodb+srv://appuser:<password>@cluster0.b0hlv98.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
console.log('\n5. Replace <password> with: AppPassword123');
console.log('6. Add your database name "deetech" after .net/');
console.log('7. Final string:');
console.log('   mongodb+srv://appuser:AppPassword123@cluster0.b0hlv98.mongodb.net/deetech?retryWrites=true&w=majority&appName=Cluster0');
console.log('\n8. Update your .env file with this string');
console.log('9. Run: npm start');