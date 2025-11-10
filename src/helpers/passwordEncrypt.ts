import { pbkdf2Sync } from "crypto";

const keyCode = process.env.SECRET_KEY || "default_secret_key";
const loopCount = 1000;
const charCount = 32;
const encType = "sha512";

/**
 * Şifreyi hash'ler.
 * @param password Hashlenecek düz şifre.
 * @returns Hex formatında hash string.
 */

export const passwordEncrypt = (password: string): string => {
  if (!password) {
    throw new Error("Password cannot be empty");
  }

  return pbkdf2Sync(password, keyCode, loopCount, charCount, encType).toString(
    "hex"
  );
};
