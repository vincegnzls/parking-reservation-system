import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Box,
  Flex,
  Input,
  Select,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Form, Formik } from "formik"
import { useRouter, withRouter } from "next/router"
import { GET_ENTRY_POINTS_BY_ID } from "../queries"
import { ParkingLotQuery, VehicleSize } from "../types"
import { PARK } from "../mutations"
import moment from "moment"

const FeeSummaryModal: React.FC<any> = ({ feeSummaryModal, lastFee }) => {
  const router = useRouter()
  const toast = useToast()
  const { id }: ParkingLotQuery = router.query

  return (
    <>
      <Modal isOpen={feeSummaryModal.isOpen} onClose={feeSummaryModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout Receipt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>You paid a total of P{lastFee}!</ModalBody>
          <ModalFooter>
            <Flex justifyContent="space-between" w="100%">
              <Button colorScheme="blue" onClick={feeSummaryModal.onClose}>
                Close
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default withRouter(FeeSummaryModal)
