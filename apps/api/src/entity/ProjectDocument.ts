import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Project } from "./Project";

@Entity()
export class ProjectDocument {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    fileUrl!: string;

    @Column()
    fileType!: string;

    @ManyToOne(() => Project, (project) => project.documents)
    project!: Project;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
