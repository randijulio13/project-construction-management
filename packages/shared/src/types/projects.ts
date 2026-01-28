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

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface ProjectDocument {
  id: number;
  name: string;
  fileUrl: string;
  fileType: string;
  projectId: number;
}

export interface ProjectUnit {
  id: number;
  blockNumber: string;
  unitType: string;
  landArea: number;
  projectId: number;
}
