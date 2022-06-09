import { ObjectType, Field, ID } from "type-graphql"
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
  OneToMany,
} from "typeorm"
import { EntryPointToParkingSlotDistance } from "./EntryPointToParkingSlotDistance"
import { ParkingLot } from "./ParkingLot"
import { Vehicle } from "./Vehicle"

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
  parkingLot!: Relation<ParkingLot>

  @Field(() => [EntryPointToParkingSlotDistance])
  @OneToMany(
    () => EntryPointToParkingSlotDistance,
    (parkingSlotDistance) => parkingSlotDistance.entryPoint,
    {
      cascade: true,
    }
  )
  parkingSlotDistances!: Relation<EntryPointToParkingSlotDistance>[]

  @Field(() => [Vehicle])
  @OneToMany(() => Vehicle, (vehicle) => vehicle.lastEntryPoint, {
    cascade: true,
  })
  vehicle!: Relation<Vehicle>[]
}
