const sinon = require('sinon');
const chai = require('chai');
const OptiwAI = require('../src');

suite('Initialization', () => {
  test('Throws error when trying to processFile without init executed', async () => {
    let error: any = null;

    sinon.replace(OptiwAI, 'optiwAISettings', {
      url: 'http://test.com',
      apiClient: '',
      apiSecret: ''
    });

    try {
      await OptiwAI.processFile('/file.png', { filename: 'file.png' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: SDK not initialized. Make sure that init() method with proper configuration has been executed.'
    );

    sinon.restore();
  });

  test('throws error when apiClient is not 36 characters long', async () => {
    let error: any = null;

    try {
      OptiwAI.init({ apiClient: 'xxx', apiSecret: 'xxx' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.include(error.message, 'length must be 36 characters long');
  });

  test('throws error when passed url is not valid uri long', async () => {
    let error: any = null;

    try {
      OptiwAI.init({ url: 'test.com/test', apiClient: 'ed8439ef-3c62-4301-8cbd-6fe399f8d43e', apiSecret: 'xxx' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.include(error.message, '"url" must be a valid uri');
  });

  test('properly initializes with correct data', async () => {
    let error: any = null;

    try {
      OptiwAI.init({
        url: 'http://test.com/test',
        apiClient: 'ed8439ef-3c62-4301-8cbd-6fe399f8d43e',
        apiSecret: 'xxx'
      });
    } catch (e) {
      error = e;
    }

    chai.assert.isNull(error);
  });

  teardown(() => {
    sinon.restore();
  });
});

suite('processFile method', () => {
  test('Throws error when filename is not passed to process data', async () => {
    let error: any = null;

    try {
      await OptiwAI.processFile('/file.png', {});
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: Upload payload invalid - child "filename" fails because ["filename" is required]'
    );
  });

  test('Throws error when processFile processMethod option is not valid', async () => {
    let error: any = null;

    try {
      await OptiwAI.processFile('/file.png', { filename: 'file.png', processMethod: 'test' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: Upload payload invalid - child "processMethod" fails because ["processMethod" must be one of [auto, retouched, lowQuality]]'
    );
  });

  test('Throws error when processFile whiteBalance option is not boolean', async () => {
    let error: any = null;

    try {
      await OptiwAI.processFile('/file.png', { filename: 'file.png', whiteBalance: 'test' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: Upload payload invalid - child "whiteBalance" fails because ["whiteBalance" must be a boolean]'
    );
  });

  test('Throws error when processFile hdr option is not boolean', async () => {
    let error: any = null;

    try {
      await OptiwAI.processFile('/file.png', { filename: 'file.png', hdr: 'test' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: Upload payload invalid - child "hdr" fails because ["hdr" must be a boolean]'
    );
  });

  test('Throws error when processFile hdr option is not boolean', async () => {
    let error: any = null;

    try {
      await OptiwAI.processFile('/file.png', { filename: 'file.png', hdr: 'test' });
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: Upload payload invalid - child "hdr" fails because ["hdr" must be a boolean]'
    );
  });

  test('processFile goes through validation when all options are valid', async () => {
    let error: any = null;

    const sendRequest = sinon.fake.resolves({});
    const getFileReadStream = sinon.fake.returns({});

    sinon.replace(OptiwAI, 'getFileReadStream', getFileReadStream);
    sinon.replace(OptiwAI, 'sendRequest', sendRequest);

    try {
      await OptiwAI.processFile('/file.png', {
        filename: 'file.png',
        hdr: true,
        whiteBalance: true,
        processMethod: 'retouched'
      });
    } catch (e) {
      error = e;
    }

    chai.assert.isNull(error);
    sinon.assert.calledOnce(sendRequest);
    sinon.assert.calledOnce(getFileReadStream);

    sinon.restore();
  });

  teardown(() => {
    sinon.restore();
  });
});

suite('getFileReadStream', () => {
  const fs = require('fs');

  test('Throws error if argument is a string and file does not exists', async () => {
    let error: any = null;

    const existsSync = sinon.fake.returns(false);

    sinon.replace(fs, 'existsSync', existsSync);

    try {
      await OptiwAI.getFileReadStream('/file.png');
    } catch (e) {
      error = e;
    }

    chai.assert.isNotNull(error);
    chai.assert.equal(
      error.message,
      'OptiwAI: File does not exists at location: /file.png. Provide absolute path, Buffer or ReadStream.'
    );
    sinon.assert.calledOnce(existsSync);

    sinon.restore();
  });

  test('Returns ReadStream if argument is a string and file exists', async () => {
    let error: any = null;

    const existsSync = sinon.fake.returns(true);
    const createReadStream = sinon.fake.returns('ReadStream');

    sinon.replace(fs, 'existsSync', existsSync);
    sinon.replace(fs, 'createReadStream', createReadStream);

    try {
      await OptiwAI.getFileReadStream('/file.png');
    } catch (e) {
      error = e;
    }

    chai.assert.isNull(error);
    sinon.assert.calledOnce(existsSync);

    sinon.assert.calledOnce(createReadStream);
    sinon.assert.calledWith(createReadStream, '/file.png');
    chai.assert.equal(createReadStream.returnValues[0], 'ReadStream');

    sinon.restore();
  });

  test('Returns ReadStream if argument is a ReadStream', async () => {
    const path = require('path');

    let result: any = null;
    let error: any = null;

    const readStream = fs.createReadStream(path.resolve(__dirname, 'index.spec.ts'));

    try {
      result = await OptiwAI.getFileReadStream(readStream);
    } catch (e) {
      error = e;
    }

    chai.assert.isNull(error);
    chai.assert.isNotNull(result);

    chai.assert.equal(result instanceof fs.ReadStream, true);
  });

  test('Returns Buffer if argument is a Buffer', async () => {
    let result: any = null;
    let error: any = null;

    const buff = Buffer.from('test');

    try {
      result = await OptiwAI.getFileReadStream(buff);
    } catch (e) {
      error = e;
    }

    chai.assert.isNull(error);
    chai.assert.isNotNull(result);

    chai.assert.equal(result instanceof Buffer, true);
  });

  teardown(() => {
    sinon.restore();
  });
});

suite('validateInit', () => {
  test('Returns false if any of settings values are falsy', async () => {
    sinon.replace(OptiwAI, 'optiwAISettings', {
      url: 'a',
      apiClient: '',
      apiSecret: 'xxx'
    });

    const result = OptiwAI.validateInit();

    chai.assert.isFalse(result);
    sinon.restore();
  });

  test('Returns true when all settings are filled', async () => {
    sinon.replace(OptiwAI, 'optiwAISettings', {
      url: 'a',
      apiClient: 'b',
      apiSecret: 'xxx'
    });

    const result = OptiwAI.validateInit();

    chai.assert.isTrue(result);
    sinon.restore();
  });

  teardown(() => {
    sinon.restore();
  });
});

suite('optiwAIError', () => {
  test('Returns error with OptiwAI: prefix', async () => {
    const err = OptiwAI.optiwAIError('My message...');
    chai.assert.equal(err.message, 'OptiwAI: My message...');
  });
});

suite('hashApiToken', () => {
  const crypto = require('crypto');

  test('Calls proper methods', async () => {
    const fakeDigest = sinon.fake.returns('digest');
    const fakeUpdate = sinon.fake.returns('update');

    const fakeCreateHmac = sinon.fake.returns({
      digest: fakeDigest,
      update: fakeUpdate
    });

    sinon.replace(crypto, 'createHmac', fakeCreateHmac);
    OptiwAI.hashApiToken('ClientID', 100, 'xxx');

    sinon.assert.calledOnce(fakeCreateHmac);
    sinon.assert.calledWith(fakeCreateHmac, 'sha256', 'xxx');

    sinon.assert.calledOnce(fakeUpdate);
    sinon.assert.calledWith(fakeUpdate, '100|ClientID');

    sinon.assert.calledOnce(fakeDigest);
    sinon.assert.calledWith(fakeDigest, 'hex');
  });

  teardown(() => {
    sinon.restore();
  });
});

suite('sendRequest', () => {
  const rp = require('request-promise');

  test('Calls request POST with proper body and returns body string parsed to JSON', async () => {
    const fakeRequest = sinon.fake.resolves('{ "linkToImage": "" }');
    sinon.replace(rp, 'post', fakeRequest);

    const clock = sinon.useFakeTimers(new Date(2019, 11, 1).getTime());

    sinon.replace(OptiwAI, 'optiwAISettings', {
      url: 'http://test.com',
      apiClient: 'api-client',
      apiSecret: 'xxx'
    });

    sinon.replace(OptiwAI, 'hashApiToken', sinon.fake.returns('api-token'));
    const file = Buffer.from('a');

    const result = await OptiwAI.sendRequest({ file, processSettings: 'processSettings...' });

    sinon.assert.calledOnce(fakeRequest);
    sinon.assert.calledWith(fakeRequest, {
      url: 'http://test.com/api/v1/upload',
      headers: {
        timestamp: new Date().getTime(),
        apiclient: 'api-client',
        apitoken: 'api-token',
        optiwai: 'processSettings...'
      },
      body: file
    });

    chai.assert.deepEqual(result, { linkToImage: '' });

    clock.restore();
  });

  teardown(() => {
    sinon.restore();
  });
});
