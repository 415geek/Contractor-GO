export class VoIPMSError extends Error {
  code: string;
  httpStatus: number;

  constructor(message: string, code: string, httpStatus = 500) {
    super(message);
    this.name = 'VoIPMSError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export function mapVoIPMSError(err: unknown): VoIPMSError {
  if (err instanceof VoIPMSError) return err;
  const message = err instanceof Error ? err.message : 'Unknown error';
  return new VoIPMSError(message, 'unknown', 500);
}
