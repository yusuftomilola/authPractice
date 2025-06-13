import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BrcyptProvider extends HashingProvider {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  }

  async compare(data: string | Buffer, hashedData: string): Promise<boolean> {
    const result = await bcrypt.compare(data, hashedData);

    return result;
  }
}
