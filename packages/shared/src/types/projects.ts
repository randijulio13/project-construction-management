export interface Project {
  id: number;
  name: string;
  address: string;
  status: string;
  startDate?: Date | string;
  endDate?: Date | string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  siteplan?: string;
  siteplanConfig?: Record<string, number>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateProjectRequest {
  name: string;
  address: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  siteplan?: string;
  siteplanConfig?: Record<string, number>;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> { }

export interface ProjectDocument {
  id: number;
  name: string;
  fileUrl: string;
  fileType: string;
  projectId: number;
}

export enum ProjectUnitSalesStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  SOLD = "SOLD",
  BLOCKED = "BLOCKED",
}

export enum ProjectUnitConstructionStatus {
  NOT_STARTED = "NOT_STARTED",
  SUBSTRUCTURE = "SUBSTRUCTURE",
  SUPERSTRUCTURE = "SUPERSTRUCTURE",
  FINISHING = "FINISHING",
  COMPLETED = "COMPLETED",
}

export interface ProjectUnitProgress {
  id: number;
  percentage: number;
  notes?: string;
  photoUrl?: string;
  unitId: number;
  createdAt: Date | string;
}

export interface ProjectUnit {
  id: number;
  blockNumber: string;
  unitType: string;
  landArea: number;
  buildingArea: number;
  salesStatus: ProjectUnitSalesStatus;
  constructionStatus: ProjectUnitConstructionStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  progress: number;
  projectId: number;
  progressLogs: ProjectUnitProgress[];
  salesOrders?: SalesOrder[];
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  identityNumber: string;
  createdAt: Date | string;
}

export interface SalesOrder {
  id: number;
  unitId: number;
  customerId: number;
  salesId: number;
  bookingDate: Date | string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  customer?: Customer;
  documents?: SalesDocument[];
  createdAt: Date | string;
}

export interface SalesDocument {
  id: number;
  salesOrderId: number;
  type: "KTP" | "NPWP" | "SPR" | "PAYMENT_PROOF" | "OTHER";
  fileUrl: string;
  createdAt: Date | string;
}
