import React, { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
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
} from "@chakra-ui/react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Form, Formik } from "formik"
import { useRouter, withRouter } from "next/router"
import { UNPARK } from "../mutations"

const UnparkModal: React.FC<any> = ({
  fetchParkingSlots,
  parkingSlot,
  isOpen,
  onOpen,
  onClose,
}) => {
  const router = useRouter()
  const toast = useToast()
  const [unpark] = useMutation(UNPARK)
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(new Date())
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (parkingSlot) {
      setCheckOutTime(new Date(parkingSlot.vehicle.lastCheckInTime))
    }
  }, [parkingSlot])

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

    console.log("PARK RESPONSE", data, errors)

    if (data.unpark.errorMessage) {
      setErrorMessage(data.unpark.errorMessage)
    } else {
      toast({
        title: "Checkout Success",
        description: "You have successfully been checked out!",
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
                  <Box mt={2}>
                    <Text>Check Out Time:</Text>
                    <DatePicker
                      // className="chakra-input css-6m1gab css-lt2rku"
                      name="checkOutTime"
                      required
                      selected={checkOutTime}
                      onChange={(date) => setCheckOutTime(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      timeIntervals={1}
                    />
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
                      Check Out
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
