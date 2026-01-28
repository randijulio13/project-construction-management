"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectUnitSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "projectNameRequired"),
    address: zod_1.z.string().min(1, "projectAddressRequired"),
    status: zod_1.z.string().default("Draft"),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    latitude: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string(), zod_1.z.undefined()])
        .transform((val) => {
        if (typeof val === "string" && val.trim() !== "")
            return parseFloat(val);
        if (typeof val === "number")
            return val;
        return undefined;
    }),
    longitude: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string(), zod_1.z.undefined()])
        .transform((val) => {
        if (typeof val === "string" && val.trim() !== "")
            return parseFloat(val);
        if (typeof val === "number")
            return val;
        return undefined;
    }),
    logo: zod_1.z.string().optional(),
    siteplan: zod_1.z.string().optional(),
});
exports.createProjectUnitSchema = zod_1.z.object({
    projectId: zod_1.z.number(),
    blockNumber: zod_1.z.string().min(1, "blockNumberRequired"),
    unitType: zod_1.z.string().min(1, "unitTypeRequired"),
    landArea: zod_1.z.number(),
    siteplanSelector: zod_1.z.string().optional().nullable(),
});
