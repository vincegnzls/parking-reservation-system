import { useMutation } from "@apollo/client"
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
} from "@chakra-ui/react"
import { Form, Formik } from "formik"
import React from "react"
import { CREATE_PARKING_LOT } from "../mutations"

interface AddParkingLotModalProps {
  fetchParkingLots?: () => Promise<void>
}

const AddParkingLotModal: React.FC<AddParkingLotModalProps> = ({
  fetchParkingLots,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createParkingLot, { data, loading, error }] =
    useMutation(CREATE_PARKING_LOT)

  return (
    <>
      <Button
        _hover={{ opacity: 0.8 }}
        bg="#37b47e"
        color="white"
        size="lg"
        onClick={onOpen}
      >
        Add Parking Lot
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              sCount: 1,
              mCount: 1,
              lCount: 1,
              entryPointsCount: 3,
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              console.log("values", values)

              const { data, errors } = await createParkingLot({
                variables: { args: values },
              })

              console.log("CREATE_PARKING_LOT", data, errors)

              if (fetchParkingLots) {
                await fetchParkingLots()
              }

              onClose()
            }}
          >
            {({ values, handleChange, isSubmitting, errors }) => (
              <Form>
                <ModalHeader>Add Parking Slot</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box>
                    <Text>Small Count:</Text>
                    <Input
                      min={1}
                      max={20}
                      type="number"
                      name="sCount"
                      value={values.sCount}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mt={2}>
                    <Text>Medium Count:</Text>
                    <Input
                      min={1}
                      max={20}
                      type="number"
                      name="mCount"
                      value={values.mCount}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mt={2}>
                    <Text>Large Count:</Text>
                    <Input
                      min={1}
                      max={20}
                      type="number"
                      name="lCount"
                      value={values.lCount}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mt={2}>
                    <Text>Number of Entry Points:</Text>
                    <Input
                      min={3}
                      max={10}
                      type="number"
                      name="entryPointsCount"
                      value={values.entryPointsCount}
                      onChange={handleChange}
                    />
                  </Box>
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
                      Save
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

export default AddParkingLotModal
