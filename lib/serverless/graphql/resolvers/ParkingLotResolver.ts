import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Query,
  Field,
  ObjectType,
} from "type-graphql"
import { IsNull, MoreThanOrEqual } from "typeorm"
import {
  ParkingLot,
  ParkingSlot,
  ParkingType,
  EntryPoint,
  EntryPointToParkingSlotDistance,
  Vehicle,
} from "../../entities/ParkingEntities"
import { IContext } from "../../utils/types"
import { ParkArgs, ParkingLotArgs, UnparkArgs } from "../types/ParkingLotTypes"

@ObjectType()
class ParkResponse {
  @Field({ nullable: true })
  errorMessage?: string

  @Field(() => Vehicle, { nullable: true })
  vehicle?: Vehicle | undefined | null
}

@Resolver()
export class ParkingLotResolver {
  randomInteger = (min: number, max: number): number =>
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
    let parkingSlot: any

    // Create parking Entry Points based on count of entry points
    for (let [idx, _] of Array(entryPointsCount).entries()) {
      let entryPoint = await EntryPoint.create({
        name: `Entry Point ${String.fromCharCode(97 + idx).toUpperCase()}`,
        parkingLot,
      }).save()
      entryPoints.push(entryPoint)
    }

    // Create Parking Slots, based on count of each size
    for (let _ of Array(sCount)) {
      parkingSlot = await ParkingSlot.create({
        type: ParkingType.SP,
        parkingLot,
      }).save()

      for (let entryPoint of entryPoints) {
        await EntryPointToParkingSlotDistance.create({
          parkingSlot,
          entryPoint,
          distance: this.randomInteger(1, 500),
        }).save()
      }
    }

    for (let _ of Array(mCount)) {
      parkingSlot = await ParkingSlot.create({
        type: ParkingType.MP,
        parkingLot,
      }).save()

      for (let entryPoint of entryPoints) {
        await EntryPointToParkingSlotDistance.create({
          parkingSlot,
          entryPoint,
          distance: this.randomInteger(1, 500),
        }).save()
      }
    }

    for (let _ of Array(lCount)) {
      parkingSlot = await ParkingSlot.create({
        type: ParkingType.LP,
        parkingLot,
      }).save()

      for (let entryPoint of entryPoints) {
        await EntryPointToParkingSlotDistance.create({
          parkingSlot,
          entryPoint,
          distance: this.randomInteger(1, 500),
        }).save()
      }
    }

    return parkingLot
  }

  @Mutation(() => ParkResponse)
  async park(
    @Arg("args")
    { parkingLotId, entryPointId, plateNumber, size, checkInTime }: ParkArgs
  ): Promise<ParkResponse> {
    // Search for the nearest compatible parking space from entrance
    const parkingSlot = await ParkingSlot.findOne({
      where: {
        isAvailable: true,
        parkingLot: { id: parkingLotId },
        entryPointDistances: { entryPoint: { id: entryPointId } },
        type: MoreThanOrEqual(size),
      },
      relations: { vehicle: true, entryPointDistances: { entryPoint: true } },
      order: {
        type: "ASC",
        entryPointDistances: { distance: "ASC" },
      },
    })

    if (parkingSlot) {
      let vehicle = await Vehicle.findOne({
        where: { plateNumber },
        relations: { parkingSlot: true },
      })

      if (!vehicle) {
        // If vehicle does not yet exist, create a new vehicle
        vehicle = await Vehicle.create({
          plateNumber,
          size,
          checkInTime: checkInTime ? checkInTime : new Date(),
          parkingSlot,
        }).save()

        await ParkingSlot.update({ id: parkingSlot.id }, { isAvailable: false })
      } else {
        if (!vehicle.parkingSlot) {
          // If vehicle exists, update existing vehicle's checkInTime depending if the continuous rate applies
          const newCheckInTime = new Date()

          await Vehicle.update(
            { id: vehicle.id },
            {
              checkInTime: vehicle.isContinuousRate(
                checkInTime ? checkInTime : newCheckInTime
              )
                ? vehicle.checkInTime
                : checkInTime
                ? checkInTime
                : new Date(),
              checkOutTime: null,
            }
          )
          await ParkingSlot.update(
            { id: parkingSlot.id },
            { vehicle, isAvailable: false }
          )
        } else {
          return {
            errorMessage: "A vehicle is still parked.",
          }
        }
      }

      vehicle = await Vehicle.findOne({
        where: { id: vehicle.id },
        relations: { parkingSlot: true },
      })

      return { vehicle }
    } else {
      return { errorMessage: "No available parking slot." }
    }
  }

  @Mutation(() => ParkResponse)
  async unpark(
    @Arg("args")
    { parkingSlotId, checkOutTime }: UnparkArgs
  ): Promise<ParkResponse> {
    const newCheckOutTime = checkOutTime ? checkOutTime : new Date()

    let vehicle = await Vehicle.findOne({
      where: { parkingSlot: { id: parkingSlotId } },
      relations: { parkingSlot: true },
    })

    if (vehicle) {
      const currentBill = await vehicle.currentBill(newCheckOutTime)

      await Vehicle.update(
        { id: vehicle.id },
        { checkOutTime: newCheckOutTime, lastBillPaid: currentBill }
      )
      await ParkingSlot.update(
        { id: parkingSlotId },
        { vehicle: null, isAvailable: true }
      )
    } else {
      return { errorMessage: "There is no vehicle parked." }
    }

    vehicle = await Vehicle.findOne({
      where: { id: vehicle.id },
      relations: { parkingSlot: true },
    })

    return { vehicle }
  }

  @Query(() => [ParkingLot], { nullable: true })
  async getParkingLots(): Promise<ParkingLot[] | null> {
    return await ParkingLot.find({
      relations: {
        parkingSlots: {
          vehicle: true,
          entryPointDistances: { entryPoint: true },
        },
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
