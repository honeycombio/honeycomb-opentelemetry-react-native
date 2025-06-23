import { by, device, expect, element, waitFor } from 'detox';
import nock from 'nock';

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

  describe('network tests', () => {
    beforeEach(() => {
      nock('http://honeycomb.io.test').get('/testget').reply(200);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should send a network request', async () => {
      await element(by.id('send_network_request')).tap();
    });
  });

  describe('errors tests', () => {
    beforeEach(async () => {
      await waitFor(element(by.id('goto_errors')))
        .toBeVisible()
        .withTimeout(3000);
      await element(by.id('goto_errors')).tap();
    });

    afterEach(async () => {
      await element(by.id('goto_main')).tap();
    });
    it('should have a Throw an Error button', async () => {
      await expect(element(by.id('throw_error'))).toBeVisible();
    });

    it('should throw an error', async () => {
      await element(by.id('throw_error')).tap();
    });

    it('should have a Throw a String button', async () => {
      await expect(element(by.id('throw_string'))).toBeVisible();
    });

    it('should throw a String', async () => {
      await element(by.id('throw_string')).tap();
    });
  });
});
