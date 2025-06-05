import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Service } from "./service.entity";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  NO_SHOW = "no_show",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

interface SpecialInstructions {
  dietary?: string[];
  medical?: string[];
  behavioral?: string[];
  other?: string[];
  pets?: string[];
}

interface Notes {
  staff?: string[];
  customer?: string[];
}

interface CancellationReason {
  reason: string;
  notes?: string;
  cancelledBy: string;
  cancelledAt: Date;
}

interface Review {
  rating: number;
  comment: string;
  createdAt: Date;
}

interface Metadata {
  source?: string;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  userId: string;

  @Column("uuid")
  serviceId: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "serviceId" })
  service: Service;

  @Column("uuid")
  petId: string;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column("timestamp")
  startTime: Date;

  @Column("timestamp")
  endTime: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  discountAmount: number;

  @Column("jsonb", { nullable: true })
  specialInstructions: SpecialInstructions;

  @Column("jsonb", { nullable: true })
  notes: Notes;

  @Column("jsonb", { nullable: true })
  cancellationReason?: CancellationReason;

  @Column("jsonb", { nullable: true })
  review?: Review;

  @Column("jsonb", { nullable: true })
  metadata: Metadata;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
