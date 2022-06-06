import { Field, InputType } from "type-graphql"

@InputType()
export class ParkingLotArgs {
  @Field()
  sCount!: number
  @Field()
  mCount!: number
  @Field()
  lCount!: number
  @Field()
  entryPointsCount!: number
}

@InputType()
export class ParkArgs {
  @Field()
  parkingLotId!: number
  @Field()
  entryPointId!: number
  @Field()
  plateNumber!: string
  @Field()
  size!: number
  @Field({ nullable: true })
  checkInTime?: Date
}

@InputType()
export class UnparkArgs {
  @Field()
  parkingSlotId!: number
  @Field({ nullable: true })
  checkOutTime?: Date
}

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
