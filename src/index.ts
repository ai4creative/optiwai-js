import * as crypto from 'crypto';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import * as rp from 'request-promise';
import {
  OptiwAIFile,
  OptiwAIProcessingResponse,
  OptiwAIRequestData,
  OptiwAISettings,
  OptiwAIUploadSettings
} from '../types';

const initSettingsValidationSchema = Joi.object({
  url: Joi.string()
    .uri()
    .optional(),
  apiClient: Joi.string()
    .length(36)
    .required(),
  apiSecret: Joi.string().required()
});

const uploadDataValidationSchema = Joi.object({
  filename: Joi.string().required(),
  processMethod: Joi.string()
    .valid('auto', 'retouched', 'lowQuality')
    .default('auto'),
  whiteBalance: Joi.boolean().default(false),
  hdr: Joi.boolean().default(false)
});

const OptiwAI = {
  optiwAISettings: {
    url: 'https://optiwai.com',
    apiClient: '',
    apiSecret: ''
  },

  optiwAIError(msg: string): Error {
    return new Error(`OptiwAI: ${msg}`);
  },
  hashApiToken(clientId: string, timestamp: number, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${timestamp}|${clientId}`);
    return hmac.digest('hex');
  },
  validateInit() {
    return !Object.values(OptiwAI.optiwAISettings).some(sett => !sett);
  },
  async sendRequest(data: OptiwAIRequestData) {
    const timestamp = new Date().getTime();
    const apiTokenString = OptiwAI.hashApiToken(
      OptiwAI.optiwAISettings.apiClient,
      timestamp,
      OptiwAI.optiwAISettings.apiSecret
    );

    try {
      const response = await rp.post({
        url: `${OptiwAI.optiwAISettings.url}/api/v1/upload`,
        headers: {
          timestamp,
          apiclient: OptiwAI.optiwAISettings.apiClient,
          apitoken: apiTokenString,
          optiwai: data.processSettings
        },
        body: data.file
      });

      return JSON.parse(response);
    } catch (e) {
      let errorMessage = e.message;
      try {
        errorMessage = JSON.parse(e.error).message;
      } catch (e) {}

      switch (e.statusCode) {
        case 400: {
          throw OptiwAI.optiwAIError(
            `400 Bad data provided. Please review your upload configuration. (${errorMessage})`
          );
        }

        case 401: {
          throw OptiwAI.optiwAIError(
            `401 Unauthorized. Are you sure that apiClient and apiSecret are correct? (${errorMessage})`
          );
        }

        case 402: {
          throw OptiwAI.optiwAIError(
            `402 No credits left. Your account does not have enough credits for new uploads, buy more via web interface. (${errorMessage})`
          );
        }

        case 403: {
          throw OptiwAI.optiwAIError(
            `403 Forbidden. Your API Key is disabled or limit has been reached. (${errorMessage})`
          );
        }

        case 404: {
          throw OptiwAI.optiwAIError(
            `404 Not found. Wrong URL provided? (${OptiwAI.optiwAISettings.url}) (${errorMessage})`
          );
        }

        case 422: {
          throw OptiwAI.optiwAIError(`422 Could not process input file or input data is invalid. (${errorMessage})`);
        }

        case 500: {
          throw OptiwAI.optiwAIError(
            `500 Internal Error. Please contact us at support@optiwai.com to resolve the issue. (${errorMessage})`
          );
        }

        default:
          throw OptiwAI.optiwAIError(e.message);
      }
    }
  },
  getFileReadStream(file: OptiwAIFile): fs.ReadStream | Buffer {
    if (file instanceof fs.ReadStream) {
      return file;
    }

    if (typeof file === 'string') {
      if (!fs.existsSync(file)) {
        throw OptiwAI.optiwAIError(
          `File does not exists at location: ${file}. Provide absolute path, Buffer or ReadStream.`
        );
      }
      return fs.createReadStream(file);
    }

    if (file instanceof Buffer) {
      return file;
    }

    throw OptiwAI.optiwAIError('Unknown type of input file. Should be one of: string, Buffer, ReadStream.');
  },

  init(settings: OptiwAISettings): void {
    Joi.assert(settings, initSettingsValidationSchema);
    OptiwAI.optiwAISettings = Object.assign({}, OptiwAI.optiwAISettings, settings);
  },
  async processFile(file: OptiwAIFile, settings: OptiwAIUploadSettings): Promise<OptiwAIProcessingResponse> {
    if (!OptiwAI.validateInit()) {
      throw OptiwAI.optiwAIError(
        'SDK not initialized. Make sure that init() method with proper configuration has been executed.'
      );
    }
    const processData = Joi.validate(settings, uploadDataValidationSchema);

    if (processData.error) {
      throw OptiwAI.optiwAIError(`Upload payload invalid - ${processData.error.message}`);
    }

    return await OptiwAI.sendRequest({
      file: OptiwAI.getFileReadStream(file),
      processSettings: Buffer.from(JSON.stringify(processData.value)).toString('base64')
    });
  }
};

if (process.env.NODE_ENV === 'package-test') {
  module.exports = OptiwAI;
} else {
  module.exports = {
    optiwAISettings: OptiwAI.optiwAISettings,
    init: OptiwAI.init,
    processFile: OptiwAI.processFile
  };
}
