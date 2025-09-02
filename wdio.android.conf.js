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

  // bağlantı/yeniden deneme toleransı
  connectionRetryTimeout: 120000,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': appPath,
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 180,
      // --- stabilite ayarları ---
      'appium:uiautomator2ServerLaunchTimeout': 120000, // uia2 server başlama süresi
      'appium:adbExecTimeout': 200000,                   // adb ağır komutlar
      'appium:disableWindowAnimation': true,             // yine animasyon kapansın
      'appium:appWaitActivity': '*',                     // activity beklemesini gevşet
    },
  ],
};