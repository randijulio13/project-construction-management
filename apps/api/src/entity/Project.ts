import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ProjectDocument } from "./ProjectDocument";
import { ProjectUnit } from "./ProjectUnit";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("text")
  address!: string;

  @Column({ default: "Draft" })
  status!: string;

  @Column({ type: "datetime", nullable: true })
  startDate?: Date;

  @Column({ type: "datetime", nullable: true })
  endDate?: Date;

  @Column("float", { nullable: true })
  latitude?: number;

  @Column("float", { nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  siteplan?: string;

  @Column({ type: "json", nullable: true })
  siteplanConfig?: Record<string, number>;

  @OneToMany(() => ProjectDocument, (document) => document.project)
  documents!: ProjectDocument[];

  @OneToMany(() => ProjectUnit, (unit) => unit.project)
  units!: ProjectUnit[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
