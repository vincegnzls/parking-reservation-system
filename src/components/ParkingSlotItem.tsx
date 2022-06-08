import {
  Box,
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  Text,
} from "@chakra-ui/react"
import moment from "moment"
import { VehicleSize } from "../types"
import { currencyFormat } from "../utils"

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
        <Flex direction="row" mt={4}>
          <Text size="sm">Check In Time:</Text>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            bg="green.400"
            textAlign="center"
            ml={2}
          >
            {moment(parkingSlot.vehicle.lastCheckInTime).format(
              "MMM D, YYYY, h:mm A"
            )}
          </Tag>
        </Flex>
      ) : null
    ) : null
  }

  const getCheckOutTime = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.checkOutTime ? (
        <Flex direction="row" mt={4}>
          <Text size="sm">Check Out Time:</Text>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            bg="green.400"
            textAlign="center"
            ml={2}
          >
            {moment(parkingSlot.vehicle.checkOutTime).format(
              "MMM D, YYYY, h:mm A"
            )}
          </Tag>
        </Flex>
      ) : null
    ) : null
  }

  const getLastFeePaid = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.lastBillPaid !== null ? (
        <Flex direction="column" alignItems="start">
          <Text size="sm" mt={2}>
            Last Fee Paid:
          </Text>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            bg="green.400"
            textAlign="center"
            mt={2}
          >
            P{currencyFormat(parkingSlot.vehicle.lastBillPaid)}
          </Tag>
        </Flex>
      ) : null
    ) : null
  }

  const getTotalFeePaid = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.totalContinuousBill !== null ? (
        <Flex direction="column" ml={2} alignItems="start">
          <Text size="sm" mt={2}>
            Total Fee Paid:
          </Text>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            bg="green.400"
            textAlign="center"
            mt={2}
          >
            P{currencyFormat(parkingSlot.vehicle.totalContinuousBill)}
          </Tag>
        </Flex>
      ) : null
    ) : null
  }

  const getRunningBill = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.totalBill !== null ? (
        <Flex direction="column" ml={2} alignItems="start" mt={2}>
          <Text size="sm">Running Fee:</Text>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            bg="green.400"
            textAlign="center"
            mt={2}
          >
            P{currencyFormat(parkingSlot.vehicle.totalBill)}
          </Tag>
        </Flex>
      ) : null
    ) : null
  }

  const getIsContinuousRate = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.isContinuousRate !== null ? (
        <Flex direction="row" mt={4} alignItems="start">
          <Text size="sm">Is Continuous Rate:</Text>
          <Tag
            size={"md"}
            borderRadius="full"
            variant="solid"
            bg="green.400"
            textAlign="center"
            ml={2}
          >
            {parkingSlot.vehicle.isContinuousRate ? "YES" : "NO"}
          </Tag>
        </Flex>
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

  const item = parkingSlot.vehicle ? (
    <Popover>
      <PopoverTrigger>
        <Flex key={idx} direction="column" _hover={{ cursor: "pointer" }}>
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

              <Heading size="sm" fontWeight="bold" mt={2}>
                Distances:
              </Heading>
              {getEntryPointDistances(parkingSlot)}
            </Flex>
          </Box>
        </Flex>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="sm" fontWeight="bold" p={1}>
            Parking Information
          </Heading>
        </PopoverHeader>
        <PopoverBody p={3}>
          {parkingSlot.vehicle ? (
            parkingSlot.vehicle.lastEntryPoint ? (
              <Flex direction="column" alignItems="start">
                <Flex>
                  <Text>Last Entry Point:</Text>
                  <Tag
                    size={"md"}
                    borderRadius="full"
                    variant="solid"
                    bg="green.400"
                    textAlign="center"
                    ml={2}
                  >
                    {getEntryPoint(parkingSlot)}
                  </Tag>
                </Flex>

                {getCheckInTime(parkingSlot)}
                {getCheckOutTime(parkingSlot)}

                <Flex direction="row" mt={1}>
                  {getLastFeePaid(parkingSlot)}
                  {getTotalFeePaid(parkingSlot)}
                  {getRunningBill(parkingSlot)}
                </Flex>

                {getIsContinuousRate(parkingSlot)}
              </Flex>
            ) : null
          ) : null}
        </PopoverBody>
        <PopoverFooter>
          <Flex>
            <Button size="sm" w="100%" onClick={() => onUnpark(parkingSlot)}>
              Check Out
            </Button>
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ) : (
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

  return item
}

export default ParkingSlotItem
