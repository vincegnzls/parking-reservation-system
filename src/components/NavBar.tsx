import { Flex, Box, Button } from "@chakra-ui/react"
import React from "react"
import AddParkingLotModal from "./AddParkingLotModal"

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex width="100%" py={16} px={36}>
      <Box ml="auto">
        {/* <Button _hover={{ opacity: 0.8 }} bg="#37b47e" color="white" size="lg">
          Add Parking Lot
        </Button> */}
        <AddParkingLotModal />
        <Button
          _hover={{ opacity: 0.8 }}
          bg="#37b47e"
          color="white"
          size="lg"
          ml={3}
          //   onClick={onOpen}
        >
          Park a Car
        </Button>
      </Box>
    </Flex>
  )
}

export default NavBar
