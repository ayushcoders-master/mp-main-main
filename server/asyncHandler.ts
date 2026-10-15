import { Request, Response, NextFunction, RequestHandler } from 'express';

/** Express 4 does not catch rejected promises; this forwards them to the error handler. */
export function asyncHandler<Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req as Req, res, next).catch(next);
  };
}
