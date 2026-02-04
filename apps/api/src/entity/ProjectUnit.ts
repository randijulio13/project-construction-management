import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Project } from "./Project";
import { ProjectUnitProgress } from "./ProjectUnitProgress";
import { SalesOrder } from "./SalesOrder";

import { ProjectUnitSalesStatus, ProjectUnitConstructionStatus } from "@construction/shared";

export { ProjectUnitSalesStatus, ProjectUnitConstructionStatus };

@Entity()
export class ProjectUnit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  blockNumber!: string;

  @Column()
  unitType!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  landArea!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  buildingArea!: number;

  @Column({
    type: "enum",
    enum: ProjectUnitSalesStatus,
    default: ProjectUnitSalesStatus.AVAILABLE,
  })
  salesStatus!: ProjectUnitSalesStatus;

  @Column({
    type: "enum",
    enum: ProjectUnitConstructionStatus,
    default: ProjectUnitConstructionStatus.NOT_STARTED,
  })
  constructionStatus!: ProjectUnitConstructionStatus;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  price!: number;

  @Column({ type: "int", default: 0 })
  bedrooms!: number;

  @Column({ type: "int", default: 0 })
  bathrooms!: number;

  @Column({ type: "int", default: 1 })
  floors!: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  progress!: number;

  @ManyToOne(() => Project, (project) => project.units)
  project!: Project;

  @OneToMany(() => ProjectUnitProgress, (progress) => progress.unit)
  progressLogs!: ProjectUnitProgress[];

  @OneToMany(() => SalesOrder, (order) => order.unit)
  salesOrders!: SalesOrder[];

  // Helper to get the active sales order
  get currentSalesOrder(): SalesOrder | undefined {
    return this.salesOrders?.find(o => o.status !== "CANCELLED");
  }

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
