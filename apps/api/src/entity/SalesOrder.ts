import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { ProjectUnit } from "./ProjectUnit";
import { Customer } from "./Customer";
import { User } from "./User";
import { SalesDocument } from "./SalesDocument";

@Entity()
export class SalesOrder {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    unitId!: number;

    @ManyToOne(() => ProjectUnit)
    @JoinColumn({ name: "unitId" })
    unit!: ProjectUnit;

    @Column()
    customerId!: number;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    @JoinColumn({ name: "customerId" })
    customer!: Customer;

    @Column()
    salesId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "salesId" })
    sales!: User;

    @Column({ type: "date" })
    bookingDate!: Date;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    totalPrice!: number;

    @Column({
        type: "enum",
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
        default: "PENDING",
    })
    status!: string;

    @OneToMany(() => SalesDocument, (doc) => doc.salesOrder)
    documents!: SalesDocument[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
