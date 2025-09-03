// path: wdio.android.conf.js
const path = require('path');
const appPath = process.env.ANDROID_APP_PATH || path.resolve(__dirname, 'app/build/outputs/apk/debug/app-debug.apk');

exports.config = {
  runner: 'local',
  specs: ['./e2e/**/*.spec.js'],
  maxInstances: 1,
  logLevel: 'info',
  framework: 'mocha',
  mochaOpts: { 
    timeout: 300000,  // 5 dakika timeout (CI için)
    retries: 2        // Başarısız testleri 2 kez tekrar dene
  },
  reporters: [
    'spec',
    ['junit', {
      outputDir: './test-results',
      outputFileFormat: function(options) {
        return `results-${options.cid}.xml`;
      }
    }]
  ],

  // Appium server konfigürasyonu
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT) || 4723,
  path: '/wd/hub',

  // Bağlantı ayarları
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,

  // Test öncesi/sonrası hooks
  beforeTest: function() {
    // Test başlamadan önce ekstra bekleme
    return new Promise(resolve => setTimeout(resolve, 2000));
  },

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:app': appPath,
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 300,
      
      // CI environment için optimizasyonlar
      'appium:uiautomator2ServerLaunchTimeout': 180000,
      'appium:adbExecTimeout': 300000,
      'appium:disableWindowAnimation': true,
      'appium:skipServerInstallation': false,
      'appium:appWaitActivity': '*',
      
      // Emulator ayarları (CI için)
      ...(process.env.CI && {
        'appium:deviceName': 'test_emulator',
        'appium:avd': 'test_emulator',
        'appium:avdLaunchTimeout': 300000,
        'appium:avdReadyTimeout': 300000,
      }),
      
      // Performans optimizasyonları
      'appium:skipLogcatCapture': true,
      'appium:dontStopAppOnReset': false,
      'appium:noReset': false,
      'appium:fullReset': true,
    },
  ],

  // Services
  services: [
    ['appium', {
      args: {
        address: process.env.APPIUM_HOST || '127.0.0.1',
        port: parseInt(process.env.APPIUM_PORT) || 4723,
        basePath: '/wd/hub',
        logLevel: 'info'
      },
      command: 'appium'
    }]
  ],
};
