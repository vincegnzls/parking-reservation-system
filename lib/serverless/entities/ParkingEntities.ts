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
import { ParkingType, VehicleSize } from "../graphql/types/ParkingLotTypes"
import { getRate } from "../utils/rate"

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

  @Field(() => [Vehicle], { nullable: true })
  @OneToMany(() => Vehicle, (vehicle) => vehicle.lastParkingLot, {
    nullable: true,
    cascade: true,
  })
  vehicleLastParked?: Vehicle[] | null

  @Field(() => Number)
  @Column("integer")
  entryPointsCount!: number

  @Field(() => Number)
  parkingSlotsCount(): number {
    return this.parkingSlots.length
  }
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

  @Field(() => [Vehicle])
  @OneToMany(() => Vehicle, (vehicle) => vehicle.lastEntryPoint, {
    cascade: true,
  })
  vehicle!: Vehicle[]
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
  lastCheckInTime?: Date | null

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamptz", nullable: true })
  checkOutTime?: Date | null

  @Field(() => ParkingSlot, { nullable: true })
  @OneToOne(() => ParkingSlot, (parkingSlot) => parkingSlot.vehicle)
  parkingSlot?: Vehicle | null

  @Field(() => EntryPoint, { nullable: true })
  @ManyToOne(() => EntryPoint, (entryPoint) => entryPoint.vehicle)
  lastEntryPoint?: EntryPoint | null

  @Field(() => ParkingLot, { nullable: true })
  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.vehicleLastParked, {
    nullable: true,
  })
  lastParkingLot?: ParkingLot | null

  @Field(() => Number, { nullable: true })
  @Column({ type: "numeric", nullable: true })
  lastBillPaid?: number

  @Field(() => Number, { defaultValue: 0 })
  @Column({ type: "numeric", default: 0 })
  totalContinuousBill: number = 0

  @Field(() => Boolean, { defaultValue: false })
  @Column({ type: "boolean", default: false })
  isContinuousRate: boolean = false

  @Field(() => Number)
  async totalBill(checkOutTime?: Date): Promise<number> {
    return await getRate({
      _vehicleId: this.id,
      _checkInTime: this.checkInTime,
      _checkOutTime: checkOutTime ? checkOutTime : this.checkOutTime,
      // _hours: 25,
    })
  }

  // @Field((type) => Number)
  // async lastEntryPointDistance(checkOutTime?: Date): Promise<number> {
  //   return await getRate({
  //     _vehicleId: this.id,
  //     _checkInTime: this.checkInTime,
  //     _checkOutTime: this.checkOutTime ? this.checkOutTime : checkOutTime,
  //     // _hours: 25,
  //   })
  // }

  _isContinuousRate(newCheckInTime: Date): boolean {
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
