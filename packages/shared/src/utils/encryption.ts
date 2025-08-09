import * as crypto from 'crypto';

export class Encryption {
  private static algorithm = 'aes-256-gcm';
  private static keyLength = 32;
  private static ivLength = 12; // 96-bit IV recommended for GCM
  private static saltLength = 64;
  private static tagLength = 16;

  static generateSalt(): string {
    return crypto.randomBytes(this.saltLength).toString('hex');
  }

  static deriveKey(password: string, salt: string): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
  }

  static encrypt(text: string, password: string, salt: string): string {
    const key = this.deriveKey(password, salt);
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = (cipher as crypto.CipherGCM).getAuthTag();
    
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  }

  static decrypt(encryptedText: string, password: string, salt: string): string {
    const key = this.deriveKey(password, salt);
    const parts = encryptedText.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  static hash(text: string, salt: string): string {
    return crypto.pbkdf2Sync(text, salt, 100000, 64, 'sha512').toString('hex');
  }

  static verify(text: string, hash: string, salt: string): boolean {
    const computedHash = this.hash(text, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computedHash, 'hex'));
  }
} 