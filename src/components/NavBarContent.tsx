import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import {
  Box,
  Heading,
  Flex,
  Button,
  useColorMode,
  Link,
} from "@chakra-ui/react"
import { withRouter } from "next/router"
import NextLink from "next/link"
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
        <NextLink href="/">
          <Link _hover={{ fontStyle: "", opacity: 0.7 }} transition="0.4s">
            <Heading size="lg">oo parking!</Heading>
          </Link>
        </NextLink>
      </Box>
      <Flex direction={{ base: "column", lg: "row" }}>
        {renderNavButtons()}
      </Flex>
    </>
  )
}

export default withRouter(NavBarContent)
