import { gql } from "@apollo/client"

export const ME = gql`
  query Me {
    me {
      userId
      firstName
      lastName
      username
    }
  }
`

export const GET_USER = gql`
  query GetUser($userId: Float!) {
    getUser(userId: $userId) {
      userId
      firstName
      lastName
      username
    }
  }
`

export const GET_PARKING_LOTS = gql`
  query GetParkingLots {
    getParkingLots {
      id
      entryPointsCount
      parkingSlotsCount
      availableSlots
    }
  }
`

export const GET_PARKING_LOT_BY_ID = gql`
  query GetParkingLotById($getParkingLotByIdId: Float!) {
    getParkingLotById(id: $getParkingLotByIdId) {
      id
      parkingSlots {
        id
        type
        entryPointDistances {
          distance
          entryPoint {
            name
          }
        }
        vehicle {
          id
          plateNumber
          size
          checkInTime
          lastCheckInTime
          checkOutTime
          lastEntryPoint {
            id
            name
          }
          lastCheckInTime
          totalBill
          lastBillPaid
          isContinuousRate
          totalContinuousBill
        }
      }
      entryPoints {
        name
      }
    }
  }
`

export const GET_ENTRY_POINTS_BY_ID = gql`
  query GetEntryPointsById($id: Float!) {
    getEntryPointsById(id: $id) {
      id
      name
    }
  }
`

export const GET_VEHICLE_BY_PLATE_NUMBER = gql`
  query GetVehicleByPlateNumber($plateNumber: String!) {
    getVehicleByPlateNumber(plateNumber: $plateNumber) {
      id
      size
      checkInTime
      lastCheckInTime
      checkOutTime
    }
  }
`

export const GET_FEE_TO_PAY = gql`
  query Query($checkOutTime: DateTime!, $id: Float!) {
    getFeeToPay(checkOutTime: $checkOutTime, id: $id)
  }
`
