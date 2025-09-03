describe('Smoke Test Suite', () => {
  beforeEach(async () => {
    // Her test öncesi app durumunu kontrol et
    console.log('Test başlıyor, app durumu kontrol ediliyor...');
  });

  afterEach(async () => {
    // Test sonrası temizlik (gerekirse)
    console.log('Test tamamlandı.');
  });

  it('Uygulama başarıyla açılmalı ve Hello CI mesajı görünmeli', async () => {
    try {
      // Uygulama açılış beklemesi - CI ortamında daha uzun sürebilir
      console.log('Uygulama açılışı bekleniyor...');
      await driver.pause(5000);

      // 1) Önce accessibility id ile dene
      console.log('Accessibility ID ile element aranıyor...');
      const accessibilityElement = await $('~hello');
      
      if (await accessibilityElement.isExisting()) {
        console.log('Element accessibility ID ile bulundu');
        await accessibilityElement.waitForDisplayed({ timeout: 15000 });
        
        // Element görünür mü kontrol et
        const isDisplayed = await accessibilityElement.isDisplayed();
        expect(isDisplayed).toBe(true);
        console.log('✅ Test başarılı: Element görünür durumda');
        return;
      }

      // 2) Accessibility ID bulunamazsa text ile dene
      console.log('Accessibility ID bulunamadı, text ile aranıyor...');
      
      // Sayfa kaynağını log'la (debug için)
      const pageSource = await driver.getPageSource();
      console.log('Sayfa kaynağı:', pageSource.substring(0, 1000) + '...');

      // Text içeriği ile ara
      const textElement = await $('android=new UiSelector().textContains("Hello CI")');
      await textElement.waitForDisplayed({ timeout: 15000 });
      
      const isTextDisplayed = await textElement.isDisplayed();
      expect(isTextDisplayed).toBe(true);
      console.log('✅ Test başarılı: Element text ile bulundu ve görünür');

    } catch (error) {
      console.error('❌ Test başarısız:', error.message);
      
      // Hata durumunda ekran görüntüsü al (debug için)
      try {
        const screenshot = await driver.takeScreenshot();
        console.log('Ekran görüntüsü alındı (base64 uzunluk):', screenshot.length);
      } catch (screenshotError) {
        console.error('Ekran görüntüsü alınamadı:', screenshotError.message);
      }
      
      throw error;
    }
  });

  it('Uygulama temel fonksiyonları çalışmalı', async () => {
    // Basit bir smoke test - app crash etmemeli
    console.log('Temel fonksiyonlar test ediliyor...');
    
    // App durumunu kontrol et
    const appState = await driver.queryAppState('com.example.cicomposeapp');
    expect(appState).toBe(4); // RUNNING_IN_FOREGROUND
    
    console.log('✅ Uygulama düzgün çalışıyor');
  });
});
