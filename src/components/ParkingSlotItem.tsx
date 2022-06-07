import { Box, Button, Flex, Heading, Tag, Text } from "@chakra-ui/react"
import moment from "moment"
import NextLink from "next/link"
import { VehicleSize } from "../types"

const ParkingSlotItem: React.FC<any> = ({ idx, parkingSlot, onUnpark }) => {
  const getParkingSlotType = (size: number): string => {
    switch (size) {
      case 1:
        return "SP"
      case 2:
        return "MP"
      case 3:
        return "LP"
      default:
        return "SP"
    }
  }

  const getVehicleType = (size: number): string => {
    const indexOfS = Object.values(VehicleSize).indexOf(
      size as unknown as VehicleSize
    )
    const key = Object.keys(VehicleSize)[indexOfS]
    return key
  }

  const getParkingSlotName = (parkingSlot: any) => {
    return `Slot ${parkingSlot.id} (${getParkingSlotType(
      parkingSlot.type
    )}) - ${getParkingSlotPlateSize(parkingSlot)}`
  }

  const getParkingSlotPlateSize = (parkingSlot: any) => {
    return `${
      parkingSlot.vehicle ? parkingSlot.vehicle.plateNumber : "VACANT"
    } ${
      parkingSlot.vehicle
        ? parkingSlot.vehicle.size
          ? "(" +
            getVehicleType(parkingSlot.vehicle ? parkingSlot.vehicle.size : 0) +
            ")"
          : ""
        : ""
    }`
  }

  const getEntryPoint = (parkingSlot: any) => {
    return parkingSlot.vehicle
      ? parkingSlot.vehicle.lastEntryPoint
        ? parkingSlot.vehicle.lastEntryPoint.name
        : ""
      : ""
  }

  const getCheckInTime = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.lastCheckInTime ? (
        <>
          <Heading size="sm" fontWeight="bold" mt={2}>
            Check In Time:
          </Heading>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            colorScheme="blackAlpha"
            textAlign="center"
            mt={2}
          >
            {moment(parkingSlot.vehicle.lastCheckInTime).format(
              "MMM D, YYYY, h:mm A"
            )}
          </Tag>
        </>
      ) : null
    ) : null
  }

  const getCheckOutTime = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.checkOutTime ? (
        <>
          <Heading size="sm" fontWeight="bold" mt={2}>
            Check Out Time:
          </Heading>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            colorScheme="blackAlpha"
            textAlign="center"
            mt={2}
          >
            {moment(parkingSlot.vehicle.checkOutTime).format(
              "MMM D, YYYY, h:mm A"
            )}
          </Tag>
        </>
      ) : null
    ) : null
  }

  const getEntryPointDistances = (parkingSlot: any) => {
    return parkingSlot?.entryPointDistances?.map(
      (distance: any, idx: number) => (
        <Tag
          key={idx}
          size={"md"}
          borderRadius="full"
          variant="solid"
          colorScheme="blackAlpha"
          textAlign="center"
          mt={2}
        >
          {distance?.entryPoint?.name} - {distance?.distance}
        </Tag>
      )
    )
  }

  return (
    <Flex key={idx} direction="column">
      <Box
        bg={`${parkingSlot.vehicle ? "tomato" : "green.400"}`}
        borderRadius={12}
        p={5}
        _hover={{ opacity: 0.8 }}
        transition="0.3s"
      >
        <Flex
          direction={"column"}
          justifyContent="center"
          alignItems="start"
          color="white"
        >
          <Heading size="sm" textTransform="uppercase" fontWeight="bold">
            {getParkingSlotName(parkingSlot)}
          </Heading>
          {parkingSlot.vehicle ? (
            parkingSlot.vehicle.lastEntryPoint ? (
              <>
                <Heading size="sm" fontWeight="bold" mt={2}>
                  Entry Point:
                </Heading>
                <Tag
                  size={"md"}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blackAlpha"
                  textAlign="center"
                  mt={2}
                >
                  {getEntryPoint(parkingSlot)}
                </Tag>
              </>
            ) : null
          ) : null}
          <Heading size="sm" fontWeight="bold" mt={2}>
            Distances:
          </Heading>
          {getEntryPointDistances(parkingSlot)}
          {getCheckInTime(parkingSlot)}
          {getCheckOutTime(parkingSlot)}
        </Flex>
      </Box>
      {parkingSlot.vehicle ? (
        <Button
          size="sm"
          colorScheme="teal"
          variant="outline"
          mt={2}
          onClick={() => onUnpark(parkingSlot)}
        >
          UNPARK
        </Button>
      ) : null}
    </Flex>
  )
}

export default ParkingSlotItem
