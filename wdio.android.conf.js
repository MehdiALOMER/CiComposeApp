const path = require('path');

const appPath = process.env.ANDROID_APP_PATH || path.resolve(__dirname, 'app/build/outputs/apk/debug/app-debug.apk');

exports.config = {
  runner: 'local',
  specs: ['./e2e/**/*.spec.js'],
  maxInstances: 1,
  logLevel: 'info',
  framework: 'mocha',
  mochaOpts: { timeout: 180000 },
  reporters: ['spec'],

  // Appium server'a bağlan (Appium 2 default: 127.0.0.1:4723)
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': appPath,
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 180,
    },
  ],
};
