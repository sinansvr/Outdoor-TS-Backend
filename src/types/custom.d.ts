// src/types/custom.d.ts
// ... AuthRequest ve Controller tanımlarının altına veya üstüne ekleyin ...
import { Model } from 'mongoose';

import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user/user.type'; // User modelinizin interface'ini import edin

// Express'in Request objesini genişleterek 'user' özelliğini ekliyoruz.
export interface AuthRequest extends Request {
  user?: IUser; // 'user' objesi IUser tipinde ve opsiyonel olabilir.
}

// Controller objemizin yapısını tanımlıyoruz.
export interface Controller {
  [key: string]: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}

declare global {
  namespace Express {
    interface Response {
      getModelList: (model: Model<any>, filters: object) => Promise<any>;
    }
  }
}