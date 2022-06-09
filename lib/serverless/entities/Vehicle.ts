import { ObjectType, Field, ID } from "type-graphql"
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Relation,
  ManyToOne,
} from "typeorm"
import { VehicleSize } from "../../../src/types"
import { getRate } from "../utils/rate"
import { EntryPoint } from "./EntryPoint"
import { ParkingLot } from "./ParkingLot"
import { ParkingSlot } from "./ParkingSlot"

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
  parkingSlot?: Relation<ParkingSlot> | null

  @Field(() => EntryPoint, { nullable: true })
  @ManyToOne(() => EntryPoint, (entryPoint) => entryPoint.vehicle)
  lastEntryPoint?: Relation<EntryPoint> | null

  @Field(() => ParkingLot, { nullable: true })
  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.vehicleLastParked, {
    nullable: true,
  })
  lastParkingLot?: Relation<ParkingLot> | null

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
      _parkingSlotType: this.parkingSlot?.type,
      _checkInTime: this.checkInTime,
      _checkOutTime: checkOutTime ? checkOutTime : this.checkOutTime,
    })
  }

  _isContinuousRate(newCheckInTime: Date): boolean {
    if (this.checkOutTime) {
      const reEntryDuration = Math.ceil(
        Math.abs(newCheckInTime.getTime() - this.checkOutTime.getTime()) / 36e5
      )

      return reEntryDuration <= 1
    }

    return false
  }
}
