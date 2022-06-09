import { ObjectType, Field, ID } from "type-graphql"
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { ParkingType } from "../../../src/types"
import { EntryPointToParkingSlotDistance } from "./EntryPointToParkingSlotDistance"
import { ParkingLot } from "./ParkingLot"
import { Vehicle } from "./Vehicle"

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

  @Field(() => ParkingLot)
  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.parkingSlots)
  parkingLot!: Relation<ParkingLot>

  @Field(() => Vehicle, { nullable: true })
  @OneToOne(() => Vehicle, (vehicle) => vehicle.parkingSlot)
  @JoinColumn()
  vehicle?: Relation<Vehicle> | null

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
  entryPointDistances!: Relation<EntryPointToParkingSlotDistance>[]
}
