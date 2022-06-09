import { FLAT_RATE, getRate } from "../lib/serverless/utils/rate"
import { ParkingType } from "../src/types"

test("Flat Rate Fee", async () => {
  for (let a = 1; a < 4; a++) {
    expect(await getRate({ _parkingSlotType: a, _hours: a })).toBe(FLAT_RATE)
    expect(await getRate({ _parkingSlotType: a, _hours: a })).toBe(FLAT_RATE)
    expect(await getRate({ _parkingSlotType: a, _hours: a })).toBe(FLAT_RATE)
  }

  expect(
    await getRate({ _parkingSlotType: ParkingType.LP, _hours: 4 })
  ).toBeGreaterThan(FLAT_RATE)
})

test("Small Slot w/ Flat Rate Fee", async () => {
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 4 })).toBe(
    60
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 5 })).toBe(
    80
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 6 })).toBe(
    100
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 24 })).toBe(
    460
  )
})

test("Medium Slot w/ Flat Rate Fee", async () => {
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 4 })).toBe(
    100
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 5 })).toBe(
    160
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 6 })).toBe(
    220
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 24 })).toBe(
    1300
  )
})

test("Large Slot w/ Flat Rate Fee", async () => {
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 4 })).toBe(
    140
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 5 })).toBe(
    240
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 6 })).toBe(
    340
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 24 })).toBe(
    2140
  )
})

test("Small Slot w/ 24-Hr Fee", async () => {
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 25 })).toBe(
    5020
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 26 })).toBe(
    5040
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 27 })).toBe(
    5060
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 48 })).toBe(
    10_000
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 49 })).toBe(
    10_020
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 72 })).toBe(
    15_000
  )
  expect(await getRate({ _parkingSlotType: ParkingType.SP, _hours: 73 })).toBe(
    15_020
  )
})

test("Medium Slot w/ 24-Hr Fee", async () => {
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 25 })).toBe(
    5060
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 26 })).toBe(
    5120
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 27 })).toBe(
    5180
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 48 })).toBe(
    10_000
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 49 })).toBe(
    10_060
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 72 })).toBe(
    15_000
  )
  expect(await getRate({ _parkingSlotType: ParkingType.MP, _hours: 73 })).toBe(
    15_060
  )
})

test("Large Slot w/ 24-Hr Fee", async () => {
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 25 })).toBe(
    5100
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 26 })).toBe(
    5200
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 27 })).toBe(
    5300
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 48 })).toBe(
    10_000
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 49 })).toBe(
    10_100
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 72 })).toBe(
    15_000
  )
  expect(await getRate({ _parkingSlotType: ParkingType.LP, _hours: 73 })).toBe(
    15_100
  )
})
