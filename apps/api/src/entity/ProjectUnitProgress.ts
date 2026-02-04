import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { ProjectUnit } from "./ProjectUnit";

@Entity()
export class ProjectUnitProgress {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    percentage!: number;

    @Column({ type: "text", nullable: true })
    notes!: string;

    @Column({ nullable: true })
    photoUrl!: string;

    @ManyToOne(() => ProjectUnit, (unit) => unit.progressLogs, { onDelete: "CASCADE" })
    unit!: ProjectUnit;

    @CreateDateColumn()
    createdAt!: Date;
}
