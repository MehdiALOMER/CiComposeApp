
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

hostname: '127.0.0.1',
port: 4723,
path: '/',

connectionRetryTimeout: 120000,

  // Appium server'ı WDIO servis olarak başlatır
services: [[
  'appium',
  {
    command: 'appium',
    args: { address: '127.0.0.1', port: 4723, basePath: '/', loglevel: 'warn' },
    logPath: './appium-ci-logs',
  },
]],

capabilities: [
  {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': appPath,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 180,
    // stabilite
    'appium:uiautomator2ServerLaunchTimeout': 120000,
    'appium:adbExecTimeout': 200000,
    'appium:disableWindowAnimation': true,
    'appium:appWaitActivity': '*',
  },
],
};