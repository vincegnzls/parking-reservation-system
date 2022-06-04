import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"

export enum ParkingType {
  SP = 1,
  MP = 2,
  LP = 3,
}

export enum VehicleSize {
  S = 1,
  M = 2,
  L = 3,
}

@ObjectType()
@Entity()
export class ParkingLot extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => [ParkingSlot])
  @OneToMany(() => ParkingSlot, (parkingSlot) => parkingSlot.parkingLot, {
    cascade: true,
  })
  parkingSlots!: ParkingSlot[]

  @Field(() => [EntryPoint])
  @OneToMany(() => EntryPoint, (entryPoint) => entryPoint.parkingLot, {
    cascade: true,
  })
  entryPoints!: EntryPoint[]

  @Field(() => Number)
  @Column("integer")
  entryPointsCount!: number
}

@ObjectType()
@Entity()
export class EntryPoint extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column("text")
  name!: string

  @Field(() => ParkingLot)
  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.entryPoints)
  parkingLot!: ParkingLot

  @Field(() => [EntryPointToParkingSlotDistance])
  @OneToMany(
    () => EntryPointToParkingSlotDistance,
    (parkingSlotDistance) => parkingSlotDistance.entryPoint,
    {
      cascade: true,
    }
  )
  parkingSlotDistances!: EntryPointToParkingSlotDistance[]
}

@ObjectType()
@Entity()
export class Vehicle extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column("text")
  plateNumber!: string

  @Field(() => Number)
  @Column({
    type: "enum",
    enum: VehicleSize,
    default: VehicleSize.S,
  })
  size: VehicleSize = VehicleSize.S

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamptz" })
  checkInTime?: Date = new Date()

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamptz" })
  checkOutTime?: Date

  @Field(() => ParkingSlot, { nullable: true })
  @OneToOne(() => ParkingSlot, (parkingSlot) => parkingSlot.vehicle)
  parkingSlot?: Vehicle

  @Field((type) => Number)
  runningBill(): number {
    return 20
  }
}

@ObjectType()
@Entity()
export class ParkingSlot extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Number)
  @Column({
    type: "enum",
    enum: ParkingType,
    default: ParkingType.SP,
  })
  type: ParkingType = ParkingType.SP

  @Field(() => ParkingLot, { nullable: true })
  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.parkingSlots)
  parkingLot?: ParkingLot

  @Field(() => Vehicle, { nullable: true })
  @OneToOne(() => Vehicle, (vehicle) => vehicle.parkingSlot)
  @JoinColumn()
  vehicle?: Vehicle

  @Field(() => [EntryPointToParkingSlotDistance])
  @OneToMany(
    () => EntryPointToParkingSlotDistance,
    (distance) => distance.parkingSlot,
    {
      cascade: true,
    }
  )
  entryPointDistances!: EntryPointToParkingSlotDistance[]
}

@ObjectType()
@Entity()
export class EntryPointToParkingSlotDistance extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Number)
  @Column("numeric")
  distance!: number

  @Field(() => ParkingSlot)
  @ManyToOne(
    () => ParkingSlot,
    (parkingSlot) => parkingSlot.entryPointDistances
  )
  parkingSlot!: ParkingSlot

  @Field(() => EntryPoint)
  @ManyToOne(() => EntryPoint, (entryPoint) => entryPoint.parkingSlotDistances)
  entryPoint!: EntryPoint
}
