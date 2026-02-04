import { z } from "zod";
import { ProjectUnitStatus } from "../types/projects";

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
  status: z.nativeEnum(ProjectUnitStatus).default(ProjectUnitStatus.AVAILABLE),
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
