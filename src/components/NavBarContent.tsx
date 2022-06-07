import { MoonIcon, SunIcon } from "@chakra-ui/icons"
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
    const navButtons: React.ReactElement<any>[] = []

    if (router.pathname === "/") {
      navButtons.push(
        <AddParkingLotModal fetchParkingLots={fetchParkingLots} key={0} />
      )
    } else if (router.pathname.includes("parking-lot")) {
      navButtons.push(
        <ParkModal fetchParkingSlots={fetchParkingSlots} key={1} />
      )
    }

    navButtons.push(
      <Button
        onClick={toggleColorMode}
        size="md"
        ml={2}
        mt={{ base: 2, lg: 0 }}
        key={2}
      >
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    )

    return navButtons
  }

  return (
    <>
      <Box>
        <Heading size="lg">oo parking!</Heading>
      </Box>
      <Flex direction={{ base: "column", lg: "row" }}>
        {renderNavButtons()}
      </Flex>
    </>
  )
}

export default withRouter(NavBarContent)
