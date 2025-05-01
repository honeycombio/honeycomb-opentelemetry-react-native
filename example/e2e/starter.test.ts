import { by, device, expect, element, waitFor } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterEach(async () => {
    await element(by.id('flush')).tap();
    await waitFor(element(by.id('status')))
      .toHaveText('Flushed')
      .withTimeout(3000);
  });

  it('should have Send a trace button', async () => {
    await expect(element(by.id('send_trace'))).toBeVisible();
  });

  it('should send a trace', async () => {
    await element(by.id('send_trace')).tap();
  });
});
