const OptiwAI = require('@optiwai/node-sdk');

OptiwAI.init({
  apiClient: 'API_CLIENT',
  apiSecret: 'API_SECRET'
});

const file = '/home/my_file.jpg';

const processingPromise = OptiwAI.processFile(file, {
  processMethod: 'retouched',
  whiteBalance: true,
  hdr: true,
  filename: 'my_file.jpg'
});

processingPromise.then(
  (result) => console.log('result', result)
);
