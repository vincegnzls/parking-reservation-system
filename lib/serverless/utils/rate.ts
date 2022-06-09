import { ParkingType } from "../../../src/types"

export const FLAT_RATE = 40
const DAILY_RATE = 5000
const FLAT_RATE_DURATION = 3

interface RateArgs {
  _parkingSlotType?: ParkingType | undefined | null
  _checkInTime?: Date | undefined | null
  _checkOutTime?: Date | undefined | null
  _hours?: number
}

export const getRate = async ({
  _parkingSlotType,
  _checkInTime,
  _checkOutTime,
  _hours,
}: RateArgs): Promise<number> => {
  const checkInTime = _checkInTime
  let checkOutTime = _checkOutTime

  if (!checkOutTime) {
    checkOutTime = new Date()
  }

  if ((checkInTime && checkOutTime) || _hours) {
    if (_parkingSlotType) {
      let hoursParked = 0

      if (_hours) {
        hoursParked = _hours
      } else if (checkInTime && checkOutTime) {
        hoursParked = Math.ceil(
          Math.abs(checkOutTime.getTime() - checkInTime.getTime()) / 36e5
        )
      }

      if (hoursParked > FLAT_RATE_DURATION) {
        const dailyCount = Math.floor(hoursParked / 24)
        let remainingHours
        let exceedingFee = 0

        if (hoursParked > 24) {
          remainingHours = hoursParked - 24 * dailyCount
        } else {
          remainingHours = hoursParked - FLAT_RATE_DURATION
        }

        switch (_parkingSlotType) {
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
