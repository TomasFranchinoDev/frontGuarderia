const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'app', 'status', '[clientId]');
fs.mkdirSync(dirPath, { recursive: true });
console.log('Directory created:', dirPath);
