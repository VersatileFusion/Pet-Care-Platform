import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

declare module 'typeorm' {
  interface Repository<T> {
    findOneBy(where: Partial<T>): Promise<T | null>;
    create(data: Partial<T>): T;
    save(entity: T): Promise<T>;
  }
} 