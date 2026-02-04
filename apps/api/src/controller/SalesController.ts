import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SalesOrder } from "../entity/SalesOrder";
import { Customer } from "../entity/Customer";
import { ProjectUnit } from "../entity/ProjectUnit";
import { SalesDocument } from "../entity/SalesDocument";
import { ProjectUnitSalesStatus } from "@construction/shared";

const salesRepository = AppDataSource.getRepository(SalesOrder);
const customerRepository = AppDataSource.getRepository(Customer);
const unitRepository = AppDataSource.getRepository(ProjectUnit);
const documentRepository = AppDataSource.getRepository(SalesDocument);

export class SalesController {
    static createOrder = async (req: Request, res: Response) => {
        try {
            const { unitId, customerId, customerData, salesId, bookingDate, totalPrice } = req.body;

            // 1. Get or Create Customer
            let customer;
            if (customerId) {
                customer = await customerRepository.findOneBy({ id: customerId });
            } else if (customerData) {
                customer = new Customer();
                customer.name = customerData.name;
                customer.email = customerData.email;
                customer.phone = customerData.phone;
                customer.address = customerData.address;
                customer.identityNumber = customerData.identityNumber;
                await customerRepository.save(customer);
            }

            if (!customer) {
                return res.status(400).json({ message: "Customer data is missing" });
            }

            // 2. Check Unit Availability
            const unit = await unitRepository.findOneBy({ id: unitId });
            if (!unit) {
                return res.status(404).json({ message: "Unit not found" });
            }

            if (unit.salesStatus === ProjectUnitSalesStatus.SOLD) {
                return res.status(400).json({ message: "Unit already sold" });
            }

            // 3. Create Sales Order
            const order = new SalesOrder();
            order.unitId = unitId;
            order.customerId = customer.id;
            order.salesId = salesId;
            order.bookingDate = new Date(bookingDate);
            order.totalPrice = totalPrice;
            order.status = "PENDING";

            await salesRepository.save(order);

            // 4. Update Unit Status
            unit.salesStatus = ProjectUnitSalesStatus.BOOKED;
            await unitRepository.save(unit);

            res.status(201).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", error });
        }
    };

    static getOrder = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const order = await salesRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["customer", "unit", "sales", "documents"],
            });

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    static addDocument = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { type } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const order = await salesRepository.findOneBy({ id: parseInt(id) });
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            const document = new SalesDocument();
            document.salesOrderId = order.id;
            document.type = type;
            document.fileUrl = `/uploads/${req.file.filename}`;

            await documentRepository.save(document);

            res.status(201).json(document);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await salesRepository.find({
                relations: ["customer", "unit", "sales"],
                order: { createdAt: "DESC" },
            });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
