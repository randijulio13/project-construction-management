import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Project } from "./Project";

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

  @ManyToOne(() => Project, (project) => project.units)
  project!: Project;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
