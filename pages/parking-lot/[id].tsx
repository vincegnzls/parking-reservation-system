import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { Flex, Tag, useDisclosure } from "@chakra-ui/react"

import client from "../../apollo-client"
import NavBar from "../../src/components/NavBar"
import { GET_PARKING_LOT_BY_ID } from "../../src/queries"
import { ParkingLotQuery } from "../../src/types"
import UnparkModal from "../../src/components/UnparkModal"
import FeeSummaryModal from "../../src/components/FeeSummaryModal"
import ParkingSlotList from "../../src/components/ParkingSlotList"

const ParkingLot: NextPage = () => {
  const router = useRouter()
  const { id }: ParkingLotQuery = router.query
  const [parkingSlots, setParkingSlots] = useState<any[]>([])
  const [entryPoints, setEntryPoints] = useState<any[]>([])
  const unparkModal = useDisclosure()
  const feeSummaryModal = useDisclosure()
  const [parkingSlot, setParkingSlot] = useState<number | null>(null)
  const [lastFee, setLastFee] = useState<any>(null)
  const { loading, data, refetch } = useQuery(GET_PARKING_LOT_BY_ID, {
    variables: { getParkingLotByIdId: parseInt(id ? id : "1") },
  })

  useEffect(() => {
    if (data && data.getParkingLotById && !loading) {
      setParkingSlots(data.getParkingLotById.parkingSlots)
      setEntryPoints(data.getParkingLotById.entryPoints)
    }
  }, [data])

  const fetchParkingSlots = async () => {
    await refetch()
  }

  const renderEntryPoints = () => {
    return entryPoints.map((entryPoint, idx) => (
      <Tag
        key={idx}
        size={"lg"}
        bg="green.400"
        mb={10}
        color="white"
        mr={5}
        px={6}
        py={4}
      >
        {entryPoint.name}
      </Tag>
    ))
  }

  const onUnpark = (_parkingSlot: any) => {
    setParkingSlot(_parkingSlot)
    unparkModal.onOpen()
  }

  return (
    <>
      <NavBar fetchParkingSlots={fetchParkingSlots} />
      <Flex
        direction="column"
        justifyContent="center"
        px={{ base: 12, md: 24, lg: 36 }}
        pb={16}
        scrollBehavior="auto"
      >
        <Flex>{renderEntryPoints()}</Flex>
        <ParkingSlotList parkingSlots={parkingSlots} onUnpark={onUnpark} />
      </Flex>
      <UnparkModal
        fetchParkingSlots={fetchParkingSlots}
        feeSummaryModal={feeSummaryModal}
        setLastFee={setLastFee}
        parkingSlot={parkingSlot}
        isOpen={unparkModal.isOpen}
        onOpen={unparkModal.onOpen}
        onClose={unparkModal.onClose}
      />
      <FeeSummaryModal feeSummaryModal={feeSummaryModal} lastFee={lastFee} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id: any = context.query.id

  const { error, data } = await client.query({
    query: GET_PARKING_LOT_BY_ID,
    variables: { getParkingLotByIdId: parseInt(id) },
    fetchPolicy: "no-cache",
  })

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
