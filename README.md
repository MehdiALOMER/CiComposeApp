# CI Compose App

Android Compose uygulaması için profesyonel CI/CD pipeline ve Appium test otomasyonu.

## 🚀 Özellikler

- **Modern Android Compose UI**
- **Appium ile E2E Test Otomasyonu**
- **GitHub Actions CI/CD Pipeline**
- **Otomatik APK Build ve Test**
- **JUnit Test Raporları**

## 📋 Gereksinimler

### Lokal Geliştirme
- **Node.js** 18+
- **Java** 11+
- **Android SDK** (API 30+)
- **Appium** (otomatik kurulur)

### CI/CD
- GitHub Actions (otomatik)
- Ubuntu runner ortamı

## 🛠️ Kurulum

### 1. Bağımlılıkları Kur
```bash
# Android bağımlılıkları
./gradlew build

# Node.js bağımlılıkları
npm install
```

### 2. APK Build Et
```bash
./gradlew assembleDebug
```

## 🧪 Test Çalıştırma

### Lokal Test (Kolay Yol)
```bash
# Tek komutla tüm süreci çalıştır
./scripts/test-local.sh
```

Bu script otomatik olarak:
- APK build eder
- Android cihaz/emulator kontrol eder
- Appium server başlatır
- Testleri çalıştırır
- Sonuçları raporlar

### Manuel Test
```bash
# 1. Appium server başlat
npm run appium

# 2. Başka terminalde test çalıştır
npm test
```

### Android Emulator Hazırlama
```bash
# AVD oluştur (bir kez)
$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd \
  --force --name test_emulator \
  --abi google_apis/x86_64 \
  --package "system-images;android-30;google_apis;x86_64"

# Emulator başlat
$ANDROID_HOME/emulator/emulator -avd test_emulator
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Pipeline otomatik olarak çalışır:

1. **Build Stage**
   - Android APK build (JDK 17)
   - Unit testler
   - APK artifact upload

2. **Validation Stage**
   - APK yapı kontrolü
   - Test konfigürasyon doğrulama
   - Dependency validation
   - Test dosyası kontrolü

> **Not:** GitHub Actions'da Android emulator güvenilir çalışmadığı için
> CI/CD pipeline validation odaklı tasarlandı. Gerçek E2E testler
> lokal ortamda `./scripts/test-local.sh` ile çalıştırılabilir.

### Tetikleyiciler
- `main` branch'e push
- `develop` branch'e push  
- `main` branch'e pull request

### Workflow Dosyası
`.github/workflows/ci.yml` - Tam otomatik pipeline

## 📊 Test Raporları

### Lokal
- Console output: Gerçek zamanlı
- JUnit XML: `test-results/` klasörü

### CI/CD
- GitHub Actions logs
- Test artifacts otomatik upload
- JUnit test sonuçları

## 🏗️ Proje Yapısı

```
CiComposeApp/
├── .github/workflows/
│   └── ci.yml                 # GitHub Actions pipeline
├── app/
│   ├── src/main/java/         # Android Compose app
│   └── build.gradle.kts       # Android build config
├── e2e/
│   └── sample.spec.js         # Appium test scenarios
├── scripts/
│   └── test-local.sh          # Local test runner
├── package.json               # Node.js dependencies
├── wdio.android.conf.js       # WebdriverIO/Appium config
└── README.md                  # Bu dosya
```

## 🔧 Konfigürasyon

### Appium Test Config (`wdio.android.conf.js`)
- **Timeout**: 5 dakika (CI için optimize)
- **Retry**: Başarısız testler 2x tekrar
- **Reporters**: Console + JUnit XML
- **CI Detection**: Otomatik emulator ayarları

### GitHub Actions Config (`.github/workflows/ci.yml`)
- **Runner**: Ubuntu latest
- **Java**: 11 (Temurin)
- **Node**: 18
- **Android**: API 30 emulator
- **Cache**: Gradle + NPM

## 🐛 Sorun Giderme

### Test Başarısız Oluyor
1. Emulator çalışıyor mu kontrol et: `adb devices`
2. APK build edildi mi kontrol et: `ls app/build/outputs/apk/debug/`
3. Appium server çalışıyor mu: `curl http://localhost:4723/wd/hub/status`

### CI/CD Başarısız Oluyor
1. GitHub Actions logs kontrol et
2. APK build stage başarılı mı
3. Android emulator başladı mı

### Element Bulunamıyor
1. Accessibility ID doğru mu: `~hello`
2. Text selector çalışıyor mu
3. Page source log'larını kontrol et

## 📈 Gelecek İyileştirmeler

- [ ] Paralel test execution
- [ ] Multiple device testing
- [ ] Performance testing
- [ ] Visual regression testing
- [ ] Slack/Teams notifications

## 🤝 Katkıda Bulunma

1. Fork et
2. Feature branch oluştur
3. Değişiklikleri commit et
4. Pull request aç

## 📄 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.
