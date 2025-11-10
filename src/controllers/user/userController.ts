import { Response, NextFunction } from "express";
import User from "../../models/user/userModel";
import Token from "../../models/token/tokenModel";
import { passwordEncrypt } from "../../helpers/passwordEncrypt";
// import { AuthRequest, Controller } from from "mongoose";
import { AuthRequest, Controller } from "../../types/custom";

export const UserController: Controller = {
  list: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const filters = req.user?.is_superadmin ? {} : { _id: req.user?._id };
      const data = await res.getModelList(User, filters);

      // FOR REACT PROJECT:
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ error: true, message: (err as Error).message });
    }
  },

  create: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      req.body.is_staff = false;
      req.body.is_superadmin = false;

      const data = await User.create(req.body);

      // Token oluştur (auto-login için)
      const tokenData = await Token.create({
        user_id: data._id,
        token: passwordEncrypt(data._id + Date.now().toString()),
      });

      res.status(201).send({
        error: false,
        token: tokenData.token,
        ...data.toObject(),
      });
    } catch (err) {
      res.status(400).send({ error: true, message: (err as Error).message });
    }
  },

  read: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const filters = req.user?.is_superadmin ? { _id: req.params.id } : { _id: req.user?._id };
      const data = await User.findOne(filters);

      res.status(200).send({ error: false, data });
    } catch (err) {
      res.status(404).send({ error: true, message: (err as Error).message });
    }
  },

  update: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const filters = req.user?.is_superadmin ? { _id: req.params.id } : { _id: req.user?._id };
      req.body.is_superadmin = req.user?.is_superadmin ? req.body.is_superadmin : false;

      const data = await User.updateOne(filters, req.body, { runValidators: true });

      res.status(202).send({
        error: false,
        data,
        new: await User.findOne(filters),
      });
    } catch (err) {
      res.status(400).send({ error: true, message: (err as Error).message });
    }
  },

  delete: async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const filters = req.user?.is_superadmin ? { _id: req.params.id } : { _id: req.user?._id };
      const data = await User.deleteOne(filters);

      res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data,
      });
    } catch (err) {
      res.status(400).send({ error: true, message: (err as Error).message });
    }
  },
};
