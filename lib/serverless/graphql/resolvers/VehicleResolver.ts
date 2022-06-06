import { Resolver, Arg, Query } from "type-graphql"
import { ParkingLot, Vehicle } from "../../entities/ParkingEntities"

@Resolver()
export class VehicleResolver {
  @Query(() => [Vehicle], { nullable: true })
  async getVehicles(): Promise<Vehicle[] | null> {
    return await Vehicle.find({
      relations: {
        parkingSlot: true,
      },
    })
  }

  @Query(() => Vehicle, { nullable: true })
  async getVehicleById(@Arg("id") id: number): Promise<Vehicle | null> {
    const vehicle = await Vehicle.findOne({
      where: { id },
      relations: {
        parkingSlot: true,
      },
    })
    return vehicle
  }

  @Query(() => Vehicle, { nullable: true })
  async getVehicleByPlateNumber(
    @Arg("plateNumber") plateNumber: string
  ): Promise<Vehicle | null> {
    const vehicle = await Vehicle.findOne({
      where: { plateNumber },
      relations: {
        parkingSlot: true,
      },
    })
    return vehicle
  }
}
