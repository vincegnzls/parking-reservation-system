import { SimpleGrid } from "@chakra-ui/react"
import React from "react"
import ParkingSlotItem from "./ParkingSlotItem"

const ParkingSlotList: React.FC<any> = ({ parkingSlots, onUnpark }) => {
  return (
    <SimpleGrid spacing={4} columns={6} minChildWidth="230px">
      {parkingSlots.map((parkingSlot: any, idx: number) => {
        return (
          <ParkingSlotItem
            key={idx}
            parkingSlot={parkingSlot}
            onUnpark={onUnpark}
          />
        )
      })}
    </SimpleGrid>
  )
}

export default ParkingSlotList
