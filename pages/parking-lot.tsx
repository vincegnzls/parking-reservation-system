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
} from "@chakra-ui/react"
import NextLink from "next/link"
import type { NextPage } from "next"
import { useEffect } from "react"
import NavBar from "../src/components/NavBar"
import { ME } from "../src/queries"

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

const ParkingLot: NextPage = () => {
  const { loading, error, data } = useQuery(ME)
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    console.log("ME QUERY", data)
  }, [data])

  return (
    <>
      <NavBar />
      <Flex p={10} justifyContent="center">
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
      </Flex>
    </>
  )
}

export default ParkingLot
