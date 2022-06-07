import { useQuery } from "@apollo/client"
import { Flex, Heading } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import NavBar from "../src/components/NavBar"
import { GET_PARKING_LOTS } from "../src/queries"
import ParkingLotList from "../src/components/ParkingLotList"

type Props = {
  data?: any[]
  error?: string
}

const Home: NextPage = (props: Props) => {
  const { loading, error, data, refetch } = useQuery(GET_PARKING_LOTS)
  const [parkingLots, setParkingLots] = useState<any[]>([])

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (data) {
      setParkingLots(data.getParkingLots)
    }
  }, [data, error])

  const fetchParkingLots = async () => {
    await refetch()
  }

  return (
    <>
      <NavBar fetchParkingLots={fetchParkingLots} />
      <Flex direction="column" px={{ base: 12, md: 24, lg: 36 }} pb={14}>
        <Heading size="md">Parking Lots</Heading>
        <ParkingLotList loading={loading} parkingLots={parkingLots} />
      </Flex>
    </>
  )
}

export default Home
