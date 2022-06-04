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
