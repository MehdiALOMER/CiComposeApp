#!/bin/bash

# Local Appium Test Runner
# Bu script lokal ortamda Appium testlerini çalıştırır

set -e

echo "🚀 Local Appium Test Runner başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonksiyonlar
print_step() {
    echo -e "${YELLOW}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Gereksinimler kontrolü
print_step "Gereksinimler kontrol ediliyor..."

if ! command -v adb &> /dev/null; then
    print_error "ADB bulunamadı. Android SDK kurulu olmalı."
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js bulunamadı."
    exit 1
fi

print_success "Gereksinimler tamam"

# 2. APK build kontrolü
print_step "APK dosyası kontrol ediliyor..."

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    print_step "APK bulunamadı, build ediliyor..."
    ./gradlew assembleDebug
    
    if [ ! -f "$APK_PATH" ]; then
        print_error "APK build edilemedi!"
        exit 1
    fi
fi

print_success "APK hazır: $APK_PATH"

# 3. Android cihaz/emulator kontrolü
print_step "Android cihaz kontrol ediliyor..."

DEVICE_COUNT=$(adb devices | grep -E "device$|emulator" | wc -l)

if [ "$DEVICE_COUNT" -eq 0 ]; then
    print_error "Hiç Android cihaz/emulator bulunamadı!"
    echo "Lütfen bir emulator başlatın veya cihaz bağlayın."
    exit 1
fi

print_success "Android cihaz/emulator bulundu"

# 4. NPM dependencies kontrolü
print_step "NPM dependencies kontrol ediliyor..."

if [ ! -d "node_modules" ]; then
    print_step "Dependencies kuruluyor..."
    npm install
fi

print_success "Dependencies hazır"

# 5. Appium server kontrolü ve başlatma
print_step "Appium server kontrol ediliyor..."

# Port 4723'ün kullanılıp kullanılmadığını kontrol et
if lsof -i :4723 >/dev/null 2>&1; then
    print_step "Port 4723 kullanımda, mevcut server kullanılacak"
else
    print_step "Appium server başlatılıyor..."
    
    # Global appium yoksa npx ile çalıştır
    if ! command -v appium &> /dev/null; then
        npx appium --port 4723 --base-path /wd/hub &
    else
        appium --port 4723 --base-path /wd/hub &
    fi
    
    APPIUM_PID=$!
    echo "Appium PID: $APPIUM_PID"
    
    # Server'ın başlamasını bekle
    sleep 5
    
    # Server'ın çalıştığını kontrol et
    if ! lsof -i :4723 >/dev/null 2>&1; then
        print_error "Appium server başlatılamadı!"
        exit 1
    fi
fi

print_success "Appium server hazır (port 4723)"

# 6. Test çalıştırma
print_step "Testler çalıştırılıyor..."

export ANDROID_APP_PATH="$(pwd)/$APK_PATH"

# Test sonuçları için klasör oluştur
mkdir -p test-results

# Testleri çalıştır
if npm test; then
    print_success "🎉 Tüm testler başarılı!"
else
    print_error "😞 Bazı testler başarısız!"
    
    # Appium server'ı durdur (eğer bu script başlattıysa)
    if [ ! -z "$APPIUM_PID" ]; then
        print_step "Appium server durduruluyor..."
        kill $APPIUM_PID 2>/dev/null || true
    fi
    
    exit 1
fi

# 7. Temizlik
if [ ! -z "$APPIUM_PID" ]; then
    print_step "Appium server durduruluyor..."
    kill $APPIUM_PID 2>/dev/null || true
fi

print_success "Test çalıştırma tamamlandı!"

echo ""
echo "📊 Test sonuçları: test-results/ klasöründe"
echo "📱 APK dosyası: $APK_PATH"
