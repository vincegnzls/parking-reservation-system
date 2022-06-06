import { gql } from "@apollo/client"

export const CREATE_PARKING_LOT = gql`
  mutation CreateParkingLot($args: ParkingLotArgs!) {
    createParkingLot(args: $args) {
      id
      entryPointsCount
    }
  }
`
export const PARK = gql`
  mutation Park($args: ParkArgs!) {
    park(args: $args) {
      errorMessage
      vehicle {
        id
        plateNumber
        size
        checkInTime
        checkOutTime
        totalBill
        lastBillPaid
        parkingSlot {
          id
          type
          isAvailable
        }
        totalContinuousBill
        isContinuousRate
      }
    }
  }
`

export const UNPARK = gql`
  mutation Unpark($args: UnparkArgs!) {
    unpark(args: $args) {
      errorMessage
      vehicle {
        id
        plateNumber
        size
        checkInTime
        checkOutTime
        lastBillPaid
        totalBill
        parkingSlot {
          id
          type
          isAvailable
        }
        totalContinuousBill
        isContinuousRate
      }
    }
  }
`
