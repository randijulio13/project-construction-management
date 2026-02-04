import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Project } from "./entity/Project";
import { ProjectDocument } from "./entity/ProjectDocument";
import { ProjectUnit } from "./entity/ProjectUnit";
import { ProjectUnitProgress } from "./entity/ProjectUnitProgress";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "construction_db",
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [User, Project, ProjectDocument, ProjectUnit, ProjectUnitProgress],
  migrations: [],
  subscribers: [],
});
