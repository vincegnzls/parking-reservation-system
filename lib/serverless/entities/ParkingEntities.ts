import { Field, ID, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { getRate } from "../utils/rate"

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
  @Column("text", { unique: true })
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
  @Column({ type: "timestamptz", nullable: true })
  checkOutTime?: Date | null

  @Field(() => ParkingSlot, { nullable: true })
  @OneToOne(() => ParkingSlot, (parkingSlot) => parkingSlot.vehicle)
  parkingSlot?: Vehicle | null

  @Field(() => Number, { nullable: true })
  @Column({ type: "numeric", nullable: true })
  lastBillPaid?: number

  @Field((type) => Number)
  async currentBill(checkOutTime?: Date): Promise<number> {
    return await getRate({
      _vehicleId: this.id,
      _checkInTime: this.checkInTime,
      _checkOutTime: this.checkOutTime ? this.checkOutTime : checkOutTime,
      // _hours: 25,
    })
  }

  isContinuousRate(newCheckInTime: Date): boolean {
    if (this.checkOutTime) {
      const reEntryDuration = Math.ceil(
        Math.abs(newCheckInTime.getTime() - this.checkOutTime.getTime()) / 36e5
      )

      console.log(
        Math.abs(newCheckInTime.getTime() - this.checkOutTime.getTime()) / 36e5
      )
      console.log("reEntryDuration", reEntryDuration)

      return reEntryDuration <= 1
    }

    return false
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
  vehicle?: Vehicle | null

  @Field(() => Boolean, { defaultValue: true })
  @Column({ type: "boolean", default: true })
  isAvailable: boolean = true

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
