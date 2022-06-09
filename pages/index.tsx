import { useQuery } from "@apollo/client"
import { Flex, Heading } from "@chakra-ui/react"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import NavBar from "../src/components/NavBar"
import { GET_PARKING_LOTS } from "../src/queries"
import ParkingLotList from "../src/components/ParkingLotList"
import { withAuth } from "../src/utils"

const Home: NextPage = (props: any) => {
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
      <NavBar fetchParkingLots={fetchParkingLots} me={props.me} />
      <Flex direction="column" px={{ base: 12, md: 24, lg: 36 }} pb={14}>
        <Heading size="lg">Parking Lots</Heading>
        <ParkingLotList loading={loading} parkingLots={parkingLots} />
      </Flex>
    </>
  )
}

export const getServerSideProps = withAuth((context: any) => {
  return { props: {} }
})

export default Home
