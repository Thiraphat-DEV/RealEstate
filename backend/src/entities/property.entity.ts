// Entity placeholder - ใช้สำหรับเมื่อเชื่อมต่อกับ database จริง (TypeORM/Prisma)
// ตอนนี้ยังใช้ mock data อยู่

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// TypeORM Example (uncomment when ready to use database):
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
//
// @Entity('properties')
// export class PropertyEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column()
//   title: string;
//
//   @Column('decimal', { precision: 12, scale: 2 })
//   price: number;
//
//   @Column()
//   location: string;
//
//   @CreateDateColumn()
//   createdAt: Date;
//
//   @UpdateDateColumn()
//   updatedAt: Date;
// }
