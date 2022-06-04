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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react"
import React from "react"

interface AddParkingLotModalProps {}

const AddParkingLotModal: React.FC<AddParkingLotModalProps> = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
          <ModalHeader>Add Parking Slot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text>Small Count:</Text>
              <NumberInput defaultValue={1} min={1} max={20}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Box mt={2}>
              <Text>Medium Count:</Text>
              <NumberInput defaultValue={1} min={1} max={20}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Box mt={2}>
              <Text>Large Count:</Text>
              <NumberInput defaultValue={1} min={1} max={20}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Box mt={2}>
              <Text>Number of Entry Points:</Text>
              <NumberInput defaultValue={1} min={1} max={20}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Flex justifyContent="space-between" w="100%">
              <Button _hover={{ opacity: 0.8 }} bg="#37b47e" color="white">
                Save
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddParkingLotModal
