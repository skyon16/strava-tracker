declare module "csurf" {
  import { Request, Response, NextFunction } from "express";

  interface CsrfOptions {
    cookie?: boolean | { [key: string]: any };
    ignoreMethods?: string[];
    value?: (req: Request) => string | undefined;
    key?: string;
    sessionKey?: string;
  }

  interface CsrfRequest extends Request {
    csrfToken(): string;
  }

  function csurf(
    options?: CsrfOptions,
  ): (req: Request, res: Response, next: NextFunction) => void;

  export = csurf;
}

declare global {
  namespace Express {
    interface Request {
      csrfToken(): string;
    }
  }
}
