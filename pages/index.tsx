import { useQuery } from "@apollo/client"
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Text,
  useColorMode,
  Link,
  Heading,
  Image,
} from "@chakra-ui/react"
import NextLink from "next/link"
import type { NextPage } from "next"
import { Component, useEffect } from "react"
import NavBar from "../src/components/NavBar"
import { GET_PARKING_LOTS, ME } from "../src/queries"

/*
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
    Slot 2
  </Tag>
  <Tag
    size={"md"}
    borderRadius="full"
    variant="solid"
    colorScheme="blackAlpha"
    textAlign="center"
    mt={2}
  >
    124XYZ
  </Tag>
</Flex>
*/

const Home: NextPage = () => {
  const { loading, error, data } = useQuery(GET_PARKING_LOTS)
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    console.log("GET_PARKING_LOTS QUERY", data)
  }, [data])

  const renderParkingLots = (): React.ReactNode => {
    //textAlign="left" mt={10}
    return (
      // <Flex direction="column" alignItems="flex-start" textAlign="left" mt={10}>
      <SimpleGrid minChildWidth={"50px"} spacing="20px" mt={10}>
        {loading
          ? null
          : data.getParkingLots.map((parkingLot: any, index: number) => {
              return (
                <>
                  <NextLink key={index} href="/parking-lot">
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
                          No. of Parking Spaces:{" "}
                          {parkingLot.parkingSlots.length}
                        </p>
                      </Flex>
                    </Link>
                  </NextLink>
                </>
              )
            })}
      </SimpleGrid>
      // </Flex>
    )
  }

  return (
    <>
      <NavBar />
      <Flex direction="column" px={36}>
        <Heading>Parking Lots</Heading>
        {renderParkingLots()}
      </Flex>
      {/* <Flex p={10} justifyContent="center">
        <SimpleGrid columns={6} spacing="10">
          <Box bg="tomato" p={8} _hover={{ opacity: 0.8 }} transition="0.3s">
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
                Slot 2 - SP
              </Tag>
              <Tag
                size={"md"}
                borderRadius="full"
                variant="solid"
                colorScheme="blackAlpha"
                textAlign="center"
                mt={2}
              >
                124XYZ
              </Tag>
            </Flex>
          </Box>
        </SimpleGrid>
      </Flex> */}
    </>
  )
}

export default Home
