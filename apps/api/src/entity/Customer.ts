import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { SalesOrder } from "./SalesOrder";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    email!: string;

    @Column()
    phone!: string;

    @Column({ type: "text", nullable: true })
    address!: string;

    @Column()
    identityNumber!: string;

    @OneToMany(() => SalesOrder, (order) => order.customer)
    orders!: SalesOrder[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
