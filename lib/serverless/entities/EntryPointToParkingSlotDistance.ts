import { ObjectType, Field, ID } from "type-graphql"
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
} from "typeorm"
import { EntryPoint } from "./EntryPoint"
import { ParkingSlot } from "./ParkingSlot"

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
  parkingSlot!: Relation<ParkingSlot>

  @Field(() => EntryPoint)
  @ManyToOne(() => EntryPoint, (entryPoint) => entryPoint.parkingSlotDistances)
  entryPoint!: Relation<EntryPoint>
}
