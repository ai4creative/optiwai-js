# OptiwAI NodeJS SDK

SDK for OptiwAI application. Fast and easy usage of API Keys for files processing via OptiwAI engine.

## Installation 
Install NPM module into your project: 
 
`npm install @optiwai/node-sdk`

## Initialization
First, import OptiwAI SDK in your application:  

`const OptiwAI = require('@optiwai/node-sdk')`  

Run the init function and pass your API Keys:  
```javascript
OptiwAI.init({
  apiClient: 'Your_API_Client_ID',
  apiSecret: 'Your_API_Secret_key'
})
```

## Optimize file API usage

Now, you should be able to use processing method available in SDK:

`const processingResult = await OptiwAI.processFile(file, options)`

It returns a promise. To grab its value use Promise.then, for example:
```javascript
const processingPromise = OptiwAI.processFile(
  fs.createReadStream('/home/images/my_image.jpg'), 
  { 
    filename: 'my_image.jpg' 
  }
);

processingPromise.then((result) => {
    console.log(result); 
    /*
      Outputs:
      { 
        thuLow: 'https://[LINK]', // Direct link to low quality thumbnail (list)
        thuHigh: 'https://[LINK]', // Direct link to high quality thumbnail (previews)
        optimized: 'https://[LINK]' // Direct link to optimized image
      }
    */
}) 
```

#### Parameters

File can be one of:

* **string** with absolute path to your file, ex. `'/home/images/my_image.jpg'`
* **Buffer**, ex. return value of `fs.readFileSync('/home/images/my_image.jpg')`
* **ReadStream**, ex. `fs.createReadStream('/home/images/my_image.jpg')`

Options:

* filename (required) - name of processed file.
* processMethod (optional, default: 'auto') - one of values: 'auto' | 'retouched' | 'lowQuality'.
* whiteBalance (optional, default: false) - Either whiteBalance is applied to processed image.
* hdr (optional, default: false) - Either HDR is applied to processed image.
* dehaze (optional, default: false) - Either Dehaze is applied to processed image.
* workflowId (optional) - Workflow ID. If valid ID is provided then all optional parameters above will be omitted. Workflow definition will be used to process given image.

#### How to get Workflow ID?

Workflows can be managed by main account (not a sub user). Using main menu go to "Workflows". List of your workflows will be shown (if it's empty you need to add new workflow). Click on "More" (three dots) on one of your workflows and select "Copy ID". Use it as *workflowId* parameter in API call.

Note: if "Copy ID" button does not work you can "Edit" your workflow and copy ID from URL.

#### Full code example

```javascript
const OptiwAI = require('@optiwai/node-sdk');

OptiwAI.init({
  apiClient: 'API_CLIENT',
  apiSecret: 'API_SECRET'
});

const file = '/home/my_file.jpg';

const processingPromise = OptiwAI.processFile(file, {
  processMethod: 'retouched',
  whiteBalance: true,
  dehaze: true,
  hdr: true,
  filename: 'my_file.jpg'
});

processingPromise.then(
  (result) => console.log('processing result', result)
);

const processingUsingWorkflow = OptiwAI.processFile(file, {
  filename: 'my_file.jpg',
  workflowId: '6380bb66-affb-45b0-86b8-581454c930ee'
});

processingUsingWorkflow.then(
  (result) => console.log('processing using workflow result', result)
);

```

## Metadata API usage

To get file metadata using OptiwAI API use *getMetadata* method available in SDK:

`const metadataResult = await OptiwAI.getMetadata(file, options)`

It returns a promise. To grab its value use Promise.then, for example:
```javascript
const metadataPromise = OptiwAI.getMetadata(
  fs.createReadStream('/home/images/my_image.jpg'), 
  { 
    filename: 'my_image.jpg' 
  }
);

metadataPromise.then((result) => {
    console.log(result); 
    /*
      Outputs:
      { 
        faces: [], // Array of detected faces on image
        celebrities: [], // Array of detected celebrities on image
        objects: [] // Array of detected objects on image
      }
    */
}) 
```

#### Parameters

File can be one of:

* **string** with absolute path to your file, ex. `'/home/images/my_image.jpg'`
* **Buffer**, ex. return value of `fs.readFileSync('/home/images/my_image.jpg')`
* **ReadStream**, ex. `fs.createReadStream('/home/images/my_image.jpg')`

Options:

* filename (required) - name of processed file.
* minConfidence (optional, default: 80) - Minimum confidence that detected item is there (in percentage).
* faces (optional, default: true) - Either detect faces on image or not.
* celebrities (optional, default: true) - Either detect celebrities on image or not.
* objects (optional, default: true) - Either detect objects on image or not.

#### Full code example

```javascript
const OptiwAI = require('@optiwai/node-sdk');

OptiwAI.init({
  apiClient: 'API_CLIENT',
  apiSecret: 'API_SECRET'
});

const file = '/home/my_file.jpg';

const metadataPromise = OptiwAI.getMetadata(file, {
  minConfidence: 50,
  faces: true,
  celebrities: true,
  objects: true,
  filename: 'my_file.jpg'
});

metadataPromise.then(
  (result) => console.log('metadata result', result)
);
```

#### Need help?
Please contact us at <support@ai4creative.com> if you need any assistance.
