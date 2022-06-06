import React, { useEffect, useState } from "react"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
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
import { GET_ENTRY_POINTS_BY_ID, GET_VEHICLE_BY_PLATE_NUMBER } from "../queries"
import { ParkingLotQuery, VehicleSize } from "../types"
import { PARK } from "../mutations"
import moment from "moment"
import CustomDateInput from "./CustomDateInput"

const ParkModal: React.FC<any> = ({ fetchParkingSlots }) => {
  const router = useRouter()
  const toast = useToast()
  const { id }: ParkingLotQuery = router.query
  const { isOpen, onOpen, onClose } = useDisclosure()
  const entryPointsQuery = useQuery(GET_ENTRY_POINTS_BY_ID, {
    variables: { id: parseInt(id ? id : "1") },
  })
  const [getVehicle, { loading, error, data }] = useLazyQuery(
    GET_VEHICLE_BY_PLATE_NUMBER,
    { fetchPolicy: "no-cache" }
  )
  const [park] = useMutation(PARK)
  const [checkInTime, setCheckInTime] = useState<Date | null>(new Date())
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [carSize, setCarSize] = useState<string>("")

  useEffect(() => {
    console.log(data)
    if (data?.getVehicleByPlateNumber) {
      if (data?.getVehicleByPlateNumber.checkOutTime) {
        setCheckInTime(new Date(data?.getVehicleByPlateNumber.checkOutTime))
      }
      if (data?.getVehicleByPlateNumber.size) {
        setCarSize(data?.getVehicleByPlateNumber.size)
      }
    }
  }, [data])

  const renderEntryPointOptions = () => {
    if (entryPointsQuery.data) {
      return entryPointsQuery.data.getEntryPointsById.map(
        (entryPoint: any, idx: number) => (
          <option key={idx} value={entryPoint.id}>
            {entryPoint.name}
          </option>
        )
      )
    }
  }

  const renderCarSizeOptions = () => {
    return Object.keys(VehicleSize)
      .filter((key) => isNaN(Number(key)))
      .map((key: any, index: number) => (
        <option key={index} value={VehicleSize[key]}>
          {key}
        </option>
      ))
  }

  const onSubmit = async (values: any) => {
    setErrorMessage("")

    const { data, errors } = await park({
      variables: {
        args: {
          ...values,
          checkInTime,
          parkingLotId: parseInt(id ? id : "1"),
          entryPointId: parseInt(values.entryPointId),
          size: parseInt(carSize),
        },
      },
    })

    if (data.park.errorMessage) {
      setErrorMessage(data.park.errorMessage)
    } else {
      toast({
        title: "Parking Success",
        description: `Vehicle successfully been parked to the nearest entrance! ${
          data?.park?.vehicle?.isContinuousRate
            ? "Continuous rate has been applied."
            : ""
        }`,
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

  const onPlateNumberChange = async (e: any, handleChange: any) => {
    handleChange(e)
    console.log(e.target.value)
    await getVehicle({ variables: { plateNumber: e.target.value } })
  }

  return (
    <>
      <Button
        _hover={{ opacity: 0.8 }}
        bg="#37b47e"
        color="white"
        size="lg"
        onClick={onOpen}
      >
        Park
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              entryPointId: "",
              plateNumber: "",
              size: "",
            }}
            onSubmit={onSubmit}
          >
            {({ values, handleChange, isSubmitting, errors }) => (
              <Form>
                <ModalHeader>Park a Car</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box>
                    <Text>Entry Point:</Text>
                    <Select
                      placeholder="Select Entry Point"
                      name="entryPointId"
                      required
                      onChange={handleChange}
                      value={values.entryPointId}
                    >
                      {renderEntryPointOptions()}
                    </Select>
                  </Box>
                  <Box mt={2}>
                    <Text>Plate Number:</Text>
                    <Input
                      min={1}
                      max={20}
                      type="text"
                      name="plateNumber"
                      required
                      value={values.plateNumber}
                      onChange={(e) => onPlateNumberChange(e, handleChange)}
                    />
                  </Box>
                  <Box mt={2}>
                    <Text>Size:</Text>
                    <Select
                      placeholder="Select Car Size"
                      name="size"
                      required
                      onChange={(e) => setCarSize(e.target.value)}
                      value={carSize}
                    >
                      {renderCarSizeOptions()}
                    </Select>
                  </Box>
                  <Box mt={2}>
                    <Text>Check In Time:</Text>
                    <DatePicker
                      name="checkInTime"
                      minDate={moment().toDate()}
                      required
                      selected={checkInTime}
                      onChange={(date) => setCheckInTime(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      timeIntervals={1}
                      customInput={<CustomDateInput />}
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
                      Park
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

export default withRouter(ParkModal)
