import { get } from "http";
import Token from "../../models/token/tokenModel";
import { AuthRequest, Controller } from "../../types/custom";
import { Response, NextFunction } from "express";   


export const TokenController: Controller = {

    get: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const filters = { _id: req.params.id }; 
      const data = await Token.findOne(filters);

      res.status(200).send({ error: false, data });
    } catch (err) {
      res.status(404).send({ error: true, message: (err as Error).message });
    }
    },   

  create: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {   
        const data = await Token.create(req.body);  
        res.status(201).send({
          error: false, 
          ...data.toObject(),
        });
    } catch (err) {
      res.status(400).send({ 
        error: true,
         message: (err as Error).message 
        });
    }       
    },

    delete: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {        
    try {
      const filters = { _id: req.params.id }; 
      await Token.deleteOne(filters);
      res.status(200).send({ error: false, message: "Token deleted successfully" });
    }   catch (err) {   
        res.status(404).send({ 
            error: true, 
            message: (err as Error).message });
    }
    }
}