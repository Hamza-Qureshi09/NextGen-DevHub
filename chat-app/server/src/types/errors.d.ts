import { MongooseError } from 'mongoose';

// types/
export interface MongooseValidationError extends Error, MongooseError {
  name: 'ValidationError';
  errors: Record<string, unknown>;
}

export interface MongooseCastError extends Error, MongooseError {
  name: 'CastError';
  kind: string;
  path: string;
  value: unknown;
}

export interface MongooseDuplicateKeyError extends Error, MongooseError {
  name: 'MongoError' | 'MongoServerError';
  code: number;
  keyValue: Record<string, unknown>;
}

export interface JsonWebTokenError extends Error {
  name: 'JsonWebTokenError';
}

export interface ErrorLogInfo {
  url?: string;
  method?: string;
  ip?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  host?: string;
  referrerUrl?: string | undefined;
  userAgent?: string | undefined;
  error: {
    status: number;
    msg: string;
    stack?: unknown;
  };
}
