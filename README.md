# OptiwAI NodeJS SDK

SDK for OptiwAI application. Fast and easy usage of API Keys for files processing via OptiwAI engine.

## Installation

Install NPM module into your project:

`npm install @optiwai/node-sdk`

## Usage
First, import OptiwAI SDK in your application:

`const OptiwAI = require('@optiwai/node-sdk`);

Run the `init` function and pass your API Keys:
```
OptiwAI.init({
    apiClient: 'Your_API_Client_ID',
    apiSecret: 'Your_API_Secret_key'
});
```

Now, you should be able to use processing method available in SDK:

`const processingResult = await opti.processFile(file, options);`

It returns a promise. To grab its value use Promise.then, for example:
```
const processingPromise = opti.processFile(fs.createReadStream('/home/images/my_image.jpg'), { filename: 'my_image.jpg' });
processingPromise.then((result) => {
    console.log(result); 
    /**
    * Outputs:
    * { 
    *   thuLow: 'https://optiwai.com/api/v1/download/c6d5b629-tl-my_image.jpg',
    *   thuHigh: 'https://optiwai.com/api/v1/download/c6d5b629-th-my_image.jpg',
    *   optimized: 'https://optiwai.com/api/v1/download/c6d5b629-o-my_image.jpg' 
    * }
    */
})
```

## Parameters

`file` can be one of:
- string with absolute path to your file, ex. '/home/images/my_image.jpg'
- Buffer, ex. return value of `fs.readFileSync('/home/images/my_image.jpg')`
- ReadStream, ex. `fs.createReadStream('/home/images/my_image.jpg')`

`options`:
- filename (required) - name of processed file.
- processMethod (optional, default: 'auto') - one of values: 'auto' | 'retouched' | 'lowQuality'.
- whiteBalance (optional, default: false) - Either whiteBalance is applied to processed image.
- hdr (optional, default: false) - Either HDR is applied to processed image.
