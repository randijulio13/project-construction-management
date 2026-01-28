import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "projectNameRequired"),
  address: z.string().min(1, "projectAddressRequired"),
  description: z.string().optional(),
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
  name: z.string().min(1, "unitNameRequired"),
  blockNumber: z.string().min(1, "blockNumberRequired"),
  unitType: z.string().min(1, "unitTypeRequired"),
  landArea: z.number(),
  siteplanSelector: z.string().optional().nullable(),
});

export type CreateProjectUnitInput = z.infer<typeof createProjectUnitSchema>;
