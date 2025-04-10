// updateAppJson.js
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Read the current app.json file
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf-8'));

// Update the 'extra' section of app.json with environment variables
appJson.expo.extra = {
  ZYOD_LOGIN_API: process.env.ZYOD_LOGIN_API,
  ZYOD_ALLOCATE_BUNDLES_API: process.env.ZYOD_ALLOCATE_BUNDLES_API,
  ZYOD_BARCODE_DETAILS_API: process.env.ZYOD_BARCODE_DETAILS_API,
  ZYOD_FETCH_LISTS_API: process.env.ZYOD_FETCH_LISTS_API,
};

// Write the updated config back to app.json
fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2));

console.log('app.json has been updated with environment variables!');
