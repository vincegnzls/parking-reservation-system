import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import NextLink from "next/link"

const ParkingLotItem: React.FC<any> = ({ index, parkingLot }) => {
  return (
    <Box
      mr={2}
      mb={3}
      shadow="md"
      bg="#37b47e"
      color="white"
      px={10}
      py={4}
      borderRadius={12}
      _hover={{
        cursor: "pointer",
        opacity: 0.8,
      }}
      transition="0.3s"
    >
      <NextLink
        key={index}
        href="/parking-lot/[id]"
        as={`/parking-lot/${parkingLot.id}`}
      >
        <Flex direction="column">
          <Heading size="md">Parking Lot {parkingLot.id}</Heading>
          <Text mt={2}>
            Entry Count: <b>{parkingLot.entryPointsCount}</b>
          </Text>
          <Text>
            Total Slots: <b>{parkingLot.parkingSlotsCount}</b>
          </Text>
        </Flex>
      </NextLink>
    </Box>
  )
}

export default ParkingLotItem
