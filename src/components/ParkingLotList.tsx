import { Flex, SimpleGrid, Spinner } from "@chakra-ui/react"
import React from "react"
import ParkingLotItem from "./ParkingLotItem"

const ParkingLotList: React.FC<any> = ({ loading, parkingLots }) => {
  return (
    <SimpleGrid spacing={2} columns={6} minChildWidth="230px" mt={8}>
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
          return <ParkingLotItem index={index} parkingLot={parkingLot} />
        })
      )}
    </SimpleGrid>
  )
}

export default ParkingLotList
