import { DataSource } from "typeorm"
import {
  ParkingLot,
  Vehicle,
  EntryPoint,
  EntryPointToParkingSlotDistance,
  ParkingSlot,
} from "../entities/ParkingEntities"

import { User } from "../entities/User"

// let connectionReadyPromise: Promise<void> | null = null;

// export function prepareConnection() {
//   if (!connectionReadyPromise) {
//     connectionReadyPromise = (async () => {
//       // clean up old connection that references outdated hot-reload classes
//       try {
//         const staleConnection = getConnection();
//         await staleConnection.close();
//       } catch (error) {
//         // no stale connection to clean up
//       }

//       // wait for new default connection
//       await createConnection({
//         // I strongly recommend using environment variables in a production environment for these
//         type: "postgres",
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         username: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         port: 5432,
//         entities: [User],
//         synchronize: process.env.NODE_ENV === "development",
//         logging: process.env.NODE_ENV === "development",
//       });
//     })();
//   }

//   return connectionReadyPromise;
// }

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 5432,
  entities: [
    EntryPoint,
    User,
    Vehicle,
    ParkingLot,
    ParkingSlot,
    EntryPointToParkingSlotDistance,
  ],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
})
