// src/models/token/tokenModel.ts

import { Schema, model, Model } from "mongoose";
import { IToken } from "./tokenType"; // Oluşturduğunuz interface'i import edin

const TokenSchema = new Schema( // Buradan <IToken> kaldırıldı
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { collection: "token", timestamps: true }
);


// module.exports yerine export default kullanın
const TokenModel: Model<IToken> = model<IToken>("Token", TokenSchema);
export default TokenModel;