import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Project } from "./entity/Project";
import { ProjectDocument } from "./entity/ProjectDocument";
import { ProjectUnit } from "./entity/ProjectUnit";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Project, ProjectDocument, ProjectUnit],
  migrations: [],
  subscribers: [],
});
