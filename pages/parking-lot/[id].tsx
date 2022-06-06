import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import {
  Flex,
  SimpleGrid,
  Box,
  Tag,
  Button,
  useDisclosure,
} from "@chakra-ui/react"

import client from "../../apollo-client"
import NavBar from "../../src/components/NavBar"
import { GET_PARKING_LOT_BY_ID } from "../../src/queries"
import { ParkingLotQuery, VehicleSize } from "../../src/types"
import UnparkModal from "../../src/components/UnparkModal"
import moment from "moment"
import FeeSummaryModal from "../../src/components/FeeSummaryModal"

const ParkingLot: NextPage = () => {
  const router = useRouter()
  const { id }: ParkingLotQuery = router.query
  const [parkingSlots, setParkingSlots] = useState<any[]>([])
  const [entryPoints, setEntryPoints] = useState<any[]>([])
  const unparkModal = useDisclosure()
  const feeSummaryModal = useDisclosure()
  const [parkingSlot, setParkingSlot] = useState<number | null>(null)
  const { loading, data, refetch } = useQuery(GET_PARKING_LOT_BY_ID, {
    variables: { getParkingLotByIdId: parseInt(id ? id : "1") },
  })

  useEffect(() => {
    feeSummaryModal.onOpen()
  }, [])

  useEffect(() => {
    if (data && data.getParkingLotById && !loading) {
      setParkingSlots(data.getParkingLotById.parkingSlots)
      setEntryPoints(data.getParkingLotById.entryPoints)
    }
  }, [data])

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

  const fetchParkingSlots = async () => {
    await refetch()
  }

  const getParkingSlotName = (parkingSlot: any) => {
    return `Slot ${parkingSlot.id} ${getParkingSlotType(parkingSlot.type)}`
  }

  const getParkingSlotPlateSize = (parkingSlot: any) => {
    return `${
      parkingSlot.vehicle ? parkingSlot.vehicle.plateNumber : "VACANT"
    } ${
      parkingSlot.vehicle
        ? parkingSlot.vehicle.size
          ? " - " +
            getVehicleType(parkingSlot.vehicle ? parkingSlot.vehicle.size : 0)
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
        <Tag
          size={"md"}
          borderRadius="full"
          variant="solid"
          colorScheme="blackAlpha"
          textAlign="center"
          mt={2}
        >
          {moment(parkingSlot.vehicle.lastCheckInTime).format(
            "MM/DD/YYYY, h:mm A"
          )}
        </Tag>
      ) : null
    ) : null
  }

  const getCheckOutTime = (parkingSlot: any) => {
    return parkingSlot.vehicle ? (
      parkingSlot.vehicle.checkOutTime ? (
        <Tag
          size={"md"}
          borderRadius="full"
          variant="solid"
          colorScheme="blackAlpha"
          textAlign="center"
          mt={2}
        >
          {moment(parkingSlot.vehicle.checkOutTime).format(
            "MM/DD/YYYY, h:mm A"
          )}
        </Tag>
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

  const renderEntryPoints = () => {
    return entryPoints.map((entryPoint, idx) => (
      <Tag
        key={idx}
        size={"lg"}
        borderRadius="full"
        bg="orange.500"
        textAlign="center"
        mb={10}
        color="white"
        mr={5}
      >
        {entryPoint.name}
      </Tag>
    ))
  }

  const onUnpark = (_parkingSlot: any) => {
    setParkingSlot(_parkingSlot)
    unparkModal.onOpen()
  }

  const renderParkingSlots = () => {
    return parkingSlots.map((parkingSlot, idx) => {
      return (
        <Flex direction="column">
          <Box
            key={idx}
            bg={`${parkingSlot.vehicle ? "tomato" : "#37b47e"}`}
            borderRadius={6}
            p={8}
            _hover={{ opacity: 0.8 }}
            transition="0.3s"
          >
            <Flex
              direction={"column"}
              justifyContent="center"
              alignItems="center"
              h="100%"
            >
              <Tag
                size={"md"}
                borderRadius="full"
                variant="solid"
                colorScheme="blackAlpha"
              >
                {getParkingSlotName(parkingSlot)}
              </Tag>
              <Tag
                size={"md"}
                borderRadius="full"
                variant="solid"
                colorScheme="blackAlpha"
                textAlign="center"
                mt={2}
              >
                {getParkingSlotPlateSize(parkingSlot)}
              </Tag>
              {parkingSlot.vehicle ? (
                parkingSlot.vehicle.lastEntryPoint ? (
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
                ) : null
              ) : null}
              {getEntryPointDistances(parkingSlot)}
              {getCheckInTime(parkingSlot)}
              {getCheckOutTime(parkingSlot)}
            </Flex>
          </Box>
          {parkingSlot.vehicle ? (
            <Button
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
    })
  }

  return (
    <>
      <NavBar fetchParkingSlots={fetchParkingSlots} />
      <Flex
        direction="column"
        justifyContent="center"
        px={{ base: 12, md: 24, lg: 36 }}
      >
        <Flex>{renderEntryPoints()}</Flex>
        <SimpleGrid
          spacing={{ base: "60px", md: "35px", lg: "30px" }}
          columns={6}
        >
          {renderParkingSlots()}
        </SimpleGrid>
      </Flex>
      <UnparkModal
        fetchParkingSlots={fetchParkingSlots}
        parkingSlot={parkingSlot}
        isOpen={unparkModal.isOpen}
        onOpen={unparkModal.onOpen}
        onClose={unparkModal.onClose}
      />
      <FeeSummaryModal feeSummaryModal={feeSummaryModal} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id: any = context.query.id

  const { error, data } = await client.query({
    query: GET_PARKING_LOT_BY_ID,
    variables: { getParkingLotByIdId: parseInt(id) },
  })

  console.log(data)

  if (!data.getParkingLotById) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      data: data.getParkingLotById,
      error: error ? error.message : null,
    },
  }
}

export default ParkingLot
