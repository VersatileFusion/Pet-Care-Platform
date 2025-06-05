import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

declare module '../data-source' {
  export const AppDataSource: DataSource;
} 