import { gql } from "@apollo/client"

export const ME = gql`
  query Me {
    me {
      userId
      firstName
      lastName
      email
    }
  }
`
export const GET_PARKING_LOTS = gql`
  query GetParkingLots {
    getParkingLots {
      id
      entryPointsCount
      parkingSlots {
        type
        id
        entryPointDistances {
          distance
          id
          entryPoint {
            id
            name
          }
        }
        vehicle {
          id
          plateNumber
          size
          checkInTime
          checkOutTime
          currentBill
          lastBillPaid
        }
      }
    }
  }
`
