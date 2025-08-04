const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 MongoDB Setup Helper\n');

console.log('Choose your MongoDB setup:');
console.log('1. MongoDB Atlas (Cloud - Recommended)');
console.log('2. Local MongoDB');
console.log('3. Use in-memory storage (no MongoDB needed)');

rl.question('\nEnter your choice (1-3): ', (choice) => {
  switch(choice) {
    case '1':
      setupAtlas();
      break;
    case '2':
      setupLocal();
      break;
    case '3':
      setupMemory();
      break;
    default:
      console.log('Invalid choice. Please run the script again.');
      rl.close();
  }
});

function setupAtlas() {
  console.log('\n📋 MongoDB Atlas Setup:');
  console.log('1. Go to https://www.mongodb.com/atlas');
  console.log('2. Create a free account');
  console.log('3. Create a new cluster (FREE tier)');
  console.log('4. Click "Connect" and choose "Connect your application"');
  console.log('5. Copy the connection string');
  
  rl.question('\nPaste your MongoDB Atlas connection string: ', (connectionString) => {
    if (connectionString.includes('mongodb+srv://')) {
      const envContent = `MONGODB_URI=${connectionString}\nPORT=5001\n`;
      fs.writeFileSync('.env', envContent);
      console.log('✅ .env file created successfully!');
      console.log('🚀 You can now run: npm run dev');
    } else {
      console.log('❌ Invalid connection string. Please check and try again.');
    }
    rl.close();
  });
}

function setupLocal() {
  console.log('\n📋 Local MongoDB Setup:');
  console.log('1. Download MongoDB from: https://www.mongodb.com/try/download/community');
  console.log('2. Install MongoDB Community Server');
  console.log('3. Start MongoDB service');
  
  const envContent = `MONGODB_URI=mongodb://localhost:27017/todo-app\nPORT=5001\n`;
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created for local MongoDB!');
  console.log('🚀 Make sure MongoDB is running, then run: npm run dev');
  rl.close();
}

function setupMemory() {
  console.log('\n📋 In-Memory Storage Setup:');
  console.log('✅ No MongoDB needed!');
  console.log('🚀 Run: npm run dev:memory');
  rl.close();
} 