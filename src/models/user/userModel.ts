import mongoose, { Schema, Document, Model } from "mongoose";
import { passwordEncrypt } from "../../helpers/passwordEncrypt";
import { IUser } from "./userType";
import { HydratedDocument } from "mongoose";

// Schema
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Pre-save hook
UserSchema.pre<IUser>("save", function (next) {
  const user = this as HydratedDocument<IUser>;

  // Email validation
  const isEmailValidated = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    user.email
  );
  if (!isEmailValidated) {
    return next(new Error("Email not validated."));
  }

  // Password Validation / Hash
  if (user.isModified("password")) {
    const isPasswordValidated =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        user.password
      );
    if (!isPasswordValidated) {
      return next(new Error("Password not validated."));
    }

    user.password = passwordEncrypt(user.password);
  }

  next();
});

// Pre-updateOne hook
UserSchema.pre("updateOne", function (next) {
  const data = this.getUpdate() as Partial<IUser> | undefined;

  if (data?.email) {
    const isEmailValidated =
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email);
    if (!isEmailValidated) return next(new Error("Email not validated."));
  }

  if (data?.password) {
    const isPasswordValidated =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        data.password
      );
    if (!isPasswordValidated) return next(new Error("Password not validated."));

    data.password = passwordEncrypt(data.password);
    this.setUpdate(data);
  }

  next();
});

// Model export
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
