import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function hashStr(str) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(str, salt);
}

export function encrypt(unencrypted_string, key) {
  const algorithm = 'aes-256-ctr';
  const iv = crypto.randomBytes(16);
  const encKey = crypto.createHash('sha256').update(String(key)).digest('base64').slice(0, 32);
  const cipher = crypto.createCipheriv(algorithm, encKey, iv);
  let crypted = cipher.update(unencrypted_string, 'utf-8', "base64") + cipher.final("base64");
  return `${crypted}-${iv.toString('base64')}`;
}

export function decrypt(encStr, key) {
  const algorithm = 'aes-256-ctr';
  const encArr = encStr.split('-');
  const encKey = crypto.createHash('sha256').update(String(key)).digest('base64').slice(0, 32);
  const decipher = crypto.createDecipheriv(algorithm, encKey, Buffer.from(encArr[1], 'base64'));
  let decrypted = decipher.update(encArr[0], 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

export async function compareStr(plainStr, hashedStr) {
  return bcrypt.compare(plainStr, hashedStr);
}