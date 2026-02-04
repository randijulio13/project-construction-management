import { z } from "zod";
import { ProjectUnitSalesStatus, ProjectUnitConstructionStatus } from "../types/projects";

export const createProjectSchema = z.object({
  name: z.string().min(1, "projectNameRequired"),
  address: z.string().min(1, "projectAddressRequired"),
  status: z.string().default("Draft"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  latitude: z
    .union([z.number(), z.string(), z.undefined()])
    .transform((val) => {
      if (typeof val === "string" && val.trim() !== "") return parseFloat(val);
      if (typeof val === "number") return val;
      return undefined;
    }),
  longitude: z
    .union([z.number(), z.string(), z.undefined()])
    .transform((val) => {
      if (typeof val === "string" && val.trim() !== "") return parseFloat(val);
      if (typeof val === "number") return val;
      return undefined;
    }),
  logo: z.string().optional(),
  siteplan: z.string().optional(),
});

export type CreateProjectInput = z.input<typeof createProjectSchema>;
export type CreateProjectOutput = z.output<typeof createProjectSchema>;

export const createProjectUnitSchema = z.object({
  projectId: z.number(),
  blockNumber: z.string().min(1, "blockNumberRequired"),
  unitType: z.string().min(1, "unitTypeRequired"),
  landArea: z.number(),
  buildingArea: z.number().default(0),
  salesStatus: z.nativeEnum(ProjectUnitSalesStatus).default(ProjectUnitSalesStatus.AVAILABLE),
  constructionStatus: z.nativeEnum(ProjectUnitConstructionStatus).default(ProjectUnitConstructionStatus.NOT_STARTED),
  price: z.number().default(0),
  bedrooms: z.number().default(0),
  bathrooms: z.number().default(0),
  floors: z.number().default(1),
  progress: z.number().default(0),
  siteplanSelector: z.string().optional().nullable(),
});

export type CreateProjectUnitInput = z.input<typeof createProjectUnitSchema>;
export type CreateProjectUnitOutput = z.output<typeof createProjectUnitSchema>;
export const updateProjectUnitSchema = createProjectUnitSchema.partial().extend({
  id: z.number(),
});
export type UpdateProjectUnitInput = z.infer<typeof updateProjectUnitSchema>;

export const createProjectUnitProgressSchema = z.object({
  unitId: z.number(),
  percentage: z.number().min(0).max(100),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
});

export type CreateProjectUnitProgressInput = z.infer<typeof createProjectUnitProgressSchema>;

export const createCustomerSchema = z.object({
  name: z.string().min(1, "customerNameRequired"),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(1, "customerPhoneRequired"),
  address: z.string().optional().nullable(),
  identityNumber: z.string().min(1, "customerIdentityRequired"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const createSalesOrderSchema = z.object({
  unitId: z.number(),
  customerId: z.number().optional(), // Can be existing or new
  customerData: createCustomerSchema.optional(), // If creating new customer
  salesId: z.number(),
  bookingDate: z.string(),
  totalPrice: z.number(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).default("PENDING"),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;

export const createSalesDocumentSchema = z.object({
  salesOrderId: z.number(),
  type: z.enum(["KTP", "NPWP", "SPR", "PAYMENT_PROOF", "OTHER"]),
  fileUrl: z.string().min(1),
});

export type CreateSalesDocumentInput = z.infer<typeof createSalesDocumentSchema>;
