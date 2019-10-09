import { ReadStream } from 'fs';

export type OptiwAISettings = {
  url: string;
  apiClient: string;
  apiSecret: string;
};

export type OptiwAIProcessingResponse = {
  thuLow: string;
  thuHigh: string;
  optimized: string;
};

export type ProcessMethod = 'auto' | 'retouched' | 'lowQuality';

export type OptiwAIRequestData = {
  processSettings: string;
  file: Buffer | ReadStream;
};

export type OptiwAIFile = Buffer | ReadStream | string;

export type OptiwAIUploadSettings = {
  /*
  Input file name.
   */
  filename: string;

  /*
  Forced method of file processing for engine. It is translated to proper engine attribute when executing.
   */
  processMethod?: ProcessMethod;

  /*
  Either whiteBalance parameter is passed or not.
   */
  whiteBalance?: boolean;

  /*
  Either hdr parameter is passed or not.
   */
  hdr?: boolean;
};

export function init(settings: OptiwAISettings): void;
export function processFile(file: OptiwAIFile, data: OptiwAIUploadSettings): Promise<OptiwAIProcessingResponse>;
