describe('Smoke', () => {
  it('Hello CI görünmeli', async () => {
    // soğuk açılış bekleme
    await driver.pause(3000);

    // 1) accessibility id dene
    const acc = await $('~hello');
    if (await acc.isExisting()) {
      await acc.waitForDisplayed({ timeout: 5000 });
      return;
    }

    // 2) bulunamadıysa sayfayı dök ve text fallback dene
    const source = await driver.getPageSource();
    // eslint-disable-next-line no-console
    console.log(source);

    const byText = await $('android=new UiSelector().textContains("Hello CI")');
    await byText.waitForDisplayed({ timeout: 10000 });
  });
});
