import { Box, Heading, Flex, Button, useColorMode } from "@chakra-ui/react"
import { withRouter } from "next/router"
import React from "react"
import AddParkingLotModal from "./AddParkingLotModal"
import ParkModal from "./ParkModal"

const NavBarContent: React.FC<any> = ({
  fetchParkingLots,
  fetchParkingSlots,
  router,
}) => {
  const { colorMode, toggleColorMode } = useColorMode()

  const renderNavButtons = () => {
    if (router.pathname === "/") {
      return (
        <>
          <AddParkingLotModal fetchParkingLots={fetchParkingLots} />
          <Button
            onClick={toggleColorMode}
            size="lg"
            ml={2}
            mt={{ base: 2, lg: 0 }}
          >
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button>
        </>
      )
    } else if (router.pathname.includes("parking-lot")) {
      return (
        <>
          <ParkModal fetchParkingSlots={fetchParkingSlots} />
        </>
      )
    }

    return null
  }

  return (
    <>
      <Box>
        <Heading>OO Parking Lot</Heading>
      </Box>
      <Flex direction={{ base: "column", lg: "row" }}>
        {renderNavButtons()}
      </Flex>
    </>
  )
}

export default withRouter(NavBarContent)
