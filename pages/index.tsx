import { useQuery } from "@apollo/client"
import { Flex, SimpleGrid, Link, Heading, Spinner } from "@chakra-ui/react"
import NextLink from "next/link"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import NavBar from "../src/components/NavBar"
import { GET_PARKING_LOTS, ME } from "../src/queries"

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

  const renderParkingLots = (): React.ReactNode => {
    return (
      <Flex>
        <SimpleGrid
          spacing={{ base: "60px", md: "35px", lg: "30px" }}
          columns={6}
          mt={10}
        >
          {loading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          ) : (
            parkingLots.map((parkingLot: any, index: number) => {
              return (
                <Flex>
                  <NextLink
                    key={index}
                    href="/parking-lot/[id]"
                    as={`/parking-lot/${parkingLot.id}`}
                  >
                    <Link
                      mr={2}
                      mb={3}
                      shadow="md"
                      bg="#37b47e"
                      color="white"
                      px={10}
                      py={4}
                      borderRadius={12}
                    >
                      <Flex direction="column">
                        <Heading size="md">Parking Lot {parkingLot.id}</Heading>
                        <p>No. of Entries: {parkingLot.entryPointsCount}</p>
                        <p>
                          No. of Parking Spaces: {parkingLot.parkingSlotsCount}
                        </p>
                      </Flex>
                    </Link>
                  </NextLink>
                </Flex>
              )
            })
          )}
        </SimpleGrid>
      </Flex>
    )
  }

  const fetchParkingLots = async () => {
    await refetch()
  }

  return (
    <>
      <NavBar fetchParkingLots={fetchParkingLots} />
      <Flex direction="column" px={{ base: 12, md: 24, lg: 36 }}>
        <Heading>Parking Lots</Heading>
        {renderParkingLots()}
      </Flex>
    </>
  )
}

export default Home
