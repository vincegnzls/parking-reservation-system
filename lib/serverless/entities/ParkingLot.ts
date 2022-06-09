import { ObjectType, Field, ID } from "type-graphql"
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
  Column,
} from "typeorm"
import { EntryPoint } from "./EntryPoint"
import { ParkingSlot } from "./ParkingSlot"
import { Vehicle } from "./Vehicle"

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
  parkingSlots!: Relation<ParkingSlot>[]

  @Field(() => [EntryPoint])
  @OneToMany(() => EntryPoint, (entryPoint) => entryPoint.parkingLot, {
    cascade: true,
  })
  entryPoints!: Relation<EntryPoint>[]

  @Field(() => [Vehicle], { nullable: true })
  @OneToMany(() => Vehicle, (vehicle) => vehicle.lastParkingLot, {
    nullable: true,
    cascade: true,
  })
  vehicleLastParked?: Relation<Vehicle>[] | null

  @Field(() => Number)
  @Column("integer")
  entryPointsCount!: number

  @Field(() => Number)
  parkingSlotsCount(): number {
    return this.parkingSlots.length
  }

  @Field(() => Number)
  availableSlots(): number {
    const parkingSlots = this.parkingSlots.filter(
      (parkingSlot) => parkingSlot.isAvailable
    )
    return parkingSlots.length
  }
}
