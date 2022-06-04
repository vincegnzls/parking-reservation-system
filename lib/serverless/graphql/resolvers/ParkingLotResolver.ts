import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql"
import {
  ParkingLot,
  ParkingSlot,
  ParkingType,
  EntryPoint,
  EntryPointToParkingSlotDistance,
} from "../../entities/ParkingEntities"
import { IContext } from "../../utils/types"
import { ParkingLotArgs } from "../types/ParkingLotTypes"

@Resolver()
export class ParkingLotResolver {
  randomInteger = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  @Mutation(() => ParkingLot, { nullable: true })
  async createParkingLot(
    @Arg("args") { sCount, mCount, lCount, entryPointsCount }: ParkingLotArgs,
    @Ctx() context: IContext
  ): Promise<ParkingLot> {
    const parkingLot: ParkingLot = await ParkingLot.create({
      entryPointsCount,
    }).save()
    const entryPoints: EntryPoint[] = []

    // Create parking Entry Points based on count of entry points
    Array.from(Array(entryPointsCount)).forEach(async (_, idx) => {
      let entryPoint = await EntryPoint.create({
        name: `Entry Point ${String.fromCharCode(97 + idx).toUpperCase()}`,
        parkingLot,
      }).save()
      entryPoints.push(entryPoint)
    })

    // Create Parking Slots, based on count of each size
    Array.from(Array(sCount)).forEach(async (x, i) => {
      let parkingSlot = await ParkingSlot.create({
        type: ParkingType.SP,
        parkingLot,
      }).save()

      // Create distances for each parking slot, and each entry point
      Array.from(entryPoints).forEach(async (entryPoint, i) => {
        await EntryPointToParkingSlotDistance.create({
          parkingSlot,
          entryPoint,
          distance: this.randomInteger(1, 500),
        }).save()
      })
    })
    Array.from(Array(mCount)).forEach(async (x, i) => {
      let parkingSlot = await ParkingSlot.create({
        type: ParkingType.MP,
        parkingLot,
      }).save()

      Array.from(entryPoints).forEach(async (entryPoint, i) => {
        await EntryPointToParkingSlotDistance.create({
          parkingSlot,
          entryPoint,
          distance: this.randomInteger(1, 500),
        }).save()
      })
    })
    Array.from(Array(lCount)).forEach(async (x, i) => {
      let parkingSlot = await ParkingSlot.create({
        type: ParkingType.LP,
        parkingLot,
      }).save()

      Array.from(entryPoints).forEach(async (entryPoint, i) => {
        await EntryPointToParkingSlotDistance.create({
          parkingSlot,
          entryPoint,
          distance: this.randomInteger(1, 500),
        }).save()
      })
    })

    return parkingLot
  }

  @Query(() => [ParkingLot], { nullable: true })
  async getParkingLots(@Ctx() context: IContext): Promise<ParkingLot[] | null> {
    return await ParkingLot.find({
      relations: {
        parkingSlots: { entryPointDistances: { entryPoint: true } },
      },
    })
  }

  @Query(() => ParkingLot, { nullable: true })
  async getParkingLotById(@Arg("id") id: number): Promise<ParkingLot | null> {
    const parkingLot = await ParkingLot.findOne({
      where: { id },
      relations: {
        parkingSlots: { entryPointDistances: { entryPoint: true } },
      },
    })
    return parkingLot
  }
}
