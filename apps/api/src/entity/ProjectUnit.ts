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
  name!: string;

  @Column()
  blockNumber!: string;

  @Column()
  unitType!: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  landArea!: number;

  @Column({ nullable: true })
  siteplanSelector?: string;

  @ManyToOne(() => Project, (project) => project.units)
  project!: Project;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
