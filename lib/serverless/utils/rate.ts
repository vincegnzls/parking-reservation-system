import { ParkingSlot } from "../entities/ParkingEntities"
import { ParkingType } from "../graphql/types/ParkingLotTypes"

const FLAT_RATE = 40
const DAILY_RATE = 5000
const FLAT_RATE_DURATION = 3

interface RateArgs {
  _vehicleId: number
  _checkInTime: Date | undefined | null
  _checkOutTime: Date | undefined | null
  _hours?: number
}

export const getRate = async ({
  _vehicleId,
  _checkInTime,
  _checkOutTime,
  _hours,
}: RateArgs): Promise<number> => {
  const checkInTime = _checkInTime
  let checkOutTime = _checkOutTime

  if (!checkOutTime) {
    checkOutTime = new Date()
  }

  if (checkInTime && checkOutTime) {
    const parkingSlot = await ParkingSlot.findOne({
      where: { vehicle: { id: _vehicleId } },
    })

    if (parkingSlot) {
      const hoursParked = _hours
        ? Math.ceil(_hours)
        : Math.ceil(
            Math.abs(checkOutTime.getTime() - checkInTime.getTime()) / 36e5
          )

      if (hoursParked > FLAT_RATE_DURATION) {
        const dailyCount = Math.floor(hoursParked / 24)
        let remainingHours
        let exceedingFee = 0

        if (hoursParked > 24) {
          remainingHours = hoursParked - 24 * dailyCount
        } else {
          remainingHours = hoursParked - FLAT_RATE_DURATION
        }

        switch (parkingSlot.type) {
          case ParkingType.SP:
            exceedingFee = remainingHours * 20
            break
          case ParkingType.MP:
            exceedingFee = remainingHours * 60
            break
          case ParkingType.LP:
            exceedingFee = remainingHours * 100
            break
        }

        if (hoursParked > 24) {
          return dailyCount * DAILY_RATE + exceedingFee
        } else {
          return FLAT_RATE + exceedingFee
        }
      }
    } else {
      return 0
    }
  }

  return FLAT_RATE
}
