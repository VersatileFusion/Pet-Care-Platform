import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceType {
  GENERAL_CARE = 'general_care',
  BOARDING = 'boarding',
  GROOMING = 'grooming',
  DAYCARE = 'daycare',
  TRAINING = 'training',
  VET_VISIT = 'vet_visit',
}

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountPrice?: number;

  @Column('int')
  duration: number; // Duration in minutes

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;

  @Column('simple-array', { nullable: true })
  includedItems: string[];

  @Column('simple-array', { nullable: true })
  requirements: string[];

  @Column('jsonb', { nullable: true })
  schedule: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    wednesday: { start: string; end: string }[];
    thursday: { start: string; end: string }[];
    friday: { start: string; end: string }[];
    saturday: { start: string; end: string }[];
    sunday: { start: string; end: string }[];
  };

  @Column('int', { default: 1 })
  maxPetsPerBooking: number;

  @Column('int', { default: 1 })
  maxBookingsPerSlot: number;

  @Column('jsonb', { nullable: true })
  images: {
    url: string;
    alt: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 