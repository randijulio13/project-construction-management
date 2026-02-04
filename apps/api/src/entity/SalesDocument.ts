import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { SalesOrder } from "./SalesOrder";

@Entity()
export class SalesDocument {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    salesOrderId!: number;

    @ManyToOne(() => SalesOrder, (order) => order.documents)
    @JoinColumn({ name: "salesOrderId" })
    salesOrder!: SalesOrder;

    @Column({
        type: "enum",
        enum: ["KTP", "NPWP", "SPR", "PAYMENT_PROOF", "OTHER"],
    })
    type!: string;

    @Column()
    fileUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
