import { Flex } from "@chakra-ui/react"
import React from "react"
import NavBarContent from "./NavBarContent"

const NavBar: React.FC<any> = ({
  fetchParkingLots,
  fetchParkingSlots,
  router,
}) => {
  return (
    <Flex
      justifyContent="space-between"
      width="100%"
      py={14}
      px={{ base: 12, md: 24, lg: 36 }}
    >
      <NavBarContent
        fetchParkingLots={fetchParkingLots}
        fetchParkingSlots={fetchParkingSlots}
      />
    </Flex>
  )
}

export default NavBar
