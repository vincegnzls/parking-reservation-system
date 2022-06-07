import { DataSource } from "typeorm"
import {
  ParkingLot,
  Vehicle,
  EntryPoint,
  EntryPointToParkingSlotDistance,
  ParkingSlot,
} from "../entities/ParkingEntities"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 5432,
  entities: [
    EntryPoint,
    Vehicle,
    ParkingLot,
    ParkingSlot,
    EntryPointToParkingSlotDistance,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
})
