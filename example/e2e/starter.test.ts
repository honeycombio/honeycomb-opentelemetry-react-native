import { by, device, expect, element } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have Send a trace button', async () => {
    await expect(element(by.id('send_trace'))).toBeVisible();
  });

  it('should send a trace', async () => {
    await element(by.id('send_trace')).tap();
  });
});
