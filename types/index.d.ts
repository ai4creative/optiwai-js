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
  url: string;
  processSettings: string;
  file: Buffer | ReadStream;
};

export type OptiwAIFile = Buffer | ReadStream | string;

export type OptiwAIMetadataResponse = {
  faces: OptiwAIMetadataResponseFaceEntity[];
  celebrities: OptiwAIMetadataResponseCelebrityEntity[];
  objects: string[];
};

export type OptiwAIMetadataResponseCelebrityEntity = {
  name: string;
  urls: string[];
  confidence: number;
  boundingBox?: BoundingBox;
};

export type OptiwAIMetadataResponseFaceEntity = {
  attributes: string[];
  ageRange?: AgeRange;
  confidence: number;
  emotions: FaceEmotion[];
  boundingBox?: BoundingBox;
};

export type BoundingBox = {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
};

export type FaceEmotionType = 'ANGRY' | 'FEAR' | 'SAD' | 'DISGUSTED' | 'CALM' | 'HAPPY' | 'SURPRISED' | 'CONFUSED';

export type FaceEmotion = {
  type: FaceEmotionType;
  confidence: number;
};

export type AgeRange = {
  Low: number;
  High: number;
};

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

export type OptiwAIMetadaSettings = {
  /*
  Input file name.
   */
  filename: string;

  /*
  Either detect faces on image or not.
   */
  faces: boolean;

  /*
  Either detect celebrities on image or not.
   */
  celebrities: boolean;

  /*
  Either detect objects on image or not.
   */
  objects: boolean;

  /*
  Minimum confidence that detected item is there (in percentage).
   */
  minConfidence: number;
};

export function init(settings: OptiwAISettings): void;
export function processFile(file: OptiwAIFile, data: OptiwAIUploadSettings): Promise<OptiwAIProcessingResponse>;
export function getMetadata(file: OptiwAIFile, data: OptiwAIMetadaSettings): Promise<OptiwAIMetadataResponse>;
