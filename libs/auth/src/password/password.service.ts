import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { deserialize, serialize } from '@phc/format';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  generateSalt() {
    return randomBytes(16);
  }

  async scrypt(password: string, salt = this.generateSalt()) {
    return new Promise<string>((resolve, reject) => {
      scrypt(password.normalize(), salt, 64, (error, derivedKey) => {
        if (error) reject(error);

        resolve(
          serialize({
            id: 'scrypt',
            salt,
            hash: derivedKey,
          }),
        );
      });
    });
  }

  async verify(password: string, hashedPassword: string) {
    const { salt } = deserialize(hashedPassword);
    const hash = await this.scrypt(password, salt);

    return timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(hashedPassword, 'hex'),
    );
  }
}
