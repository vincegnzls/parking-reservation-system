import React, { useEffect, useState } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import {
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
  Alert,
  AlertIcon,
  useToast,
  Spinner,
} from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Form, Formik } from "formik"
import { useRouter, withRouter } from "next/router"
import { UNPARK } from "../mutations"
import CustomDateInput from "./CustomDateInput"
import moment from "moment"
import { currencyFormat } from "../utils"
import { ParkingType } from "../types"
import { GET_FEE_TO_PAY } from "../queries"

const UnparkModal: React.FC<any> = ({
  fetchParkingSlots,
  parkingSlot,
  isOpen,
  onOpen,
  onClose,
  feeSummaryModal,
  setLastFee,
}) => {
  const router = useRouter()
  const toast = useToast()
  const [unpark] = useMutation(UNPARK)
  const [getFee, { loading, error, data }] = useLazyQuery(GET_FEE_TO_PAY, {
    fetchPolicy: "no-cache",
  })
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(new Date())
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (parkingSlot) {
      setCheckOutTime(new Date(parkingSlot.vehicle.lastCheckInTime))
    }
  }, [parkingSlot])

  useEffect(() => {
    if (parkingSlot && parkingSlot.vehicle && checkOutTime) {
      console.log(checkOutTime)
      updateFee()
    }
  }, [parkingSlot, checkOutTime])

  const updateFee = async () => {
    await getFee({
      variables: { id: parseInt(parkingSlot.vehicle.id), checkOutTime },
    })
  }

  const getFeeDisplay = () => {
    if (loading) {
      return <Spinner size="sm" />
    } else {
      if (data && data.getFeeToPay) {
        return `P${currencyFormat(data.getFeeToPay)}`
      }
    }

    return "P0.00"
  }

  const onSubmit = async (values: any) => {
    setErrorMessage("")

    const { data, errors } = await unpark({
      variables: {
        args: {
          parkingSlotId: parseInt(parkingSlot.id),
          checkOutTime,
        },
      },
    })

    if (data.unpark.errorMessage) {
      setErrorMessage(data.unpark.errorMessage)
    } else {
      toast({
        title: "Checkout Success",
        description: `Vehicle with plate number ${
          data.unpark.vehicle.plateNumber
        } has successfully been checked out! Total fee paid is P${currencyFormat(
          data.unpark.vehicle.lastBillPaid
        )}.`,
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      })

      onClose()

      if (fetchParkingSlots) {
        await fetchParkingSlots()
      }
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik initialValues={{}} onSubmit={onSubmit}>
            {({ values, handleChange, isSubmitting, errors }) => (
              <Form>
                <ModalHeader>Checkout a Car</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box>
                    <Text mb={1}>
                      Slot Type: <b>{ParkingType[parkingSlot.type]}</b>
                    </Text>
                    <Text mb={1}>
                      Plate Number: <b>{parkingSlot.vehicle.plateNumber}</b>
                    </Text>
                    <Text mb={1}>
                      Last Check In Time:{" "}
                      <b>
                        {moment(parkingSlot.vehicle.lastCheckInTime).format(
                          "MMM D, YYYY, h:mm A"
                        )}
                      </b>
                    </Text>
                    <Text mb={1}>Check Out Time:</Text>
                    <DatePicker
                      name="checkOutTime"
                      required
                      selected={checkOutTime}
                      onChange={(date) => setCheckOutTime(date)}
                      showTimeSelect
                      dateFormat="MMM d, yyyy h:mm aa"
                      timeIntervals={1}
                      customInput={<CustomDateInput />}
                    />
                    <Text mt={1}>
                      Fee: <b>{getFeeDisplay()}</b>
                    </Text>
                  </Box>
                  {errorMessage.length ? (
                    <Alert status="error" mt={4}>
                      <AlertIcon />
                      {errorMessage}
                    </Alert>
                  ) : null}
                </ModalBody>

                <ModalFooter>
                  <Flex justifyContent="space-between" w="100%">
                    <Button
                      type="submit"
                      _hover={{ opacity: 0.8 }}
                      bg="#37b47e"
                      color="white"
                      isLoading={isSubmitting}
                    >
                      Checkout
                    </Button>
                    <Button colorScheme="blue" onClick={onClose}>
                      Close
                    </Button>
                  </Flex>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}

export default withRouter(UnparkModal)
