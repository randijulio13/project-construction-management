import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Project as ProjectEntity } from "../entity/Project";
import { ProjectDocument as DocumentEntity } from "../entity/ProjectDocument";
import { ProjectUnit as UnitEntity } from "../entity/ProjectUnit";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  Project as ProjectType,
} from "@construction/shared";

const projectRepository = AppDataSource.getRepository(ProjectEntity);
const documentRepository = AppDataSource.getRepository(DocumentEntity);
const unitRepository = AppDataSource.getRepository(UnitEntity);

export class ProjectController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const projects = await projectRepository.find({
        order: { createdAt: "DESC" },
      });
      res.json(projects as ProjectType[]);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects", error });
    }
  };

  static getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await projectRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["documents", "units"],
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project", error });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const {
        name,
        address,
        description,
        status,
        startDate,
        endDate,
        latitude,
        longitude,
        logo,
        siteplan,
      }: CreateProjectRequest = req.body;

      const project = new ProjectEntity();
      project.name = name;
      project.address = address;
      project.description = description;
      project.status = status || "Draft";
      project.startDate = startDate ? new Date(startDate) : undefined;
      project.endDate = endDate ? new Date(endDate) : undefined;
      project.latitude = latitude;
      project.longitude = longitude;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle logo
      if (files?.logo?.[0]) {
        project.logo = `/uploads/${files.logo[0].filename}`;
      } else {
        project.logo = logo;
      }

      // Handle siteplan
      if (files?.siteplan?.[0]) {
        project.siteplan = `/uploads/${files.siteplan[0].filename}`;
      } else {
        project.siteplan = siteplan;
      }

      await projectRepository.save(project);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Error creating project", error });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        name,
        address,
        description,
        status,
        startDate,
        endDate,
        latitude,
        longitude,
        logo,
        siteplan,
      }: UpdateProjectRequest = req.body;

      const project = await projectRepository.findOneBy({ id: parseInt(id) });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.name = name ?? project.name;
      project.address = address ?? project.address;
      project.description = description ?? project.description;
      project.status = status ?? project.status;
      project.startDate = startDate ? new Date(startDate) : project.startDate;
      project.endDate = endDate ? new Date(endDate) : project.endDate;
      project.latitude = latitude ?? project.latitude;
      project.longitude = longitude ?? project.longitude;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle logo
      if (files?.logo?.[0]) {
        project.logo = `/uploads/${files.logo[0].filename}`;
      } else if (logo !== undefined) {
        project.logo = logo;
      }

      // Handle siteplan
      if (files?.siteplan?.[0]) {
        project.siteplan = `/uploads/${files.siteplan[0].filename}`;
      } else if (siteplan !== undefined) {
        project.siteplan = siteplan;
      }

      await projectRepository.save(project);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Error updating project", error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await projectRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting project", error });
    }
  };

  static addDocument = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, fileUrl, fileType } = req.body;

      const project = await projectRepository.findOneBy({ id: parseInt(id) });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const document = new DocumentEntity();
      document.name = name;
      document.fileUrl = fileUrl;
      document.fileType = fileType;
      document.project = project;

      await documentRepository.save(document);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: "Error adding document", error });
    }
  };

  static addUnit = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, blockNumber, unitType, siteplanSelector } = req.body;

      const project = await projectRepository.findOneBy({ id: parseInt(id) });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const unit = new UnitEntity();
      unit.name = name;
      unit.blockNumber = blockNumber;
      unit.unitType = unitType;
      unit.landArea = req.body.landArea || 0;
      unit.siteplanSelector = siteplanSelector;
      unit.project = project;

      await unitRepository.save(unit);
      res.status(201).json(unit);
    } catch (error) {
      res.status(400).json({ message: "Error adding unit", error });
    }
  };

  static updateUnit = async (req: Request, res: Response) => {
    try {
      const { unitId } = req.params;
      const { name, blockNumber, unitType, siteplanSelector } = req.body;

      const unit = await unitRepository.findOneBy({ id: parseInt(unitId) });
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }

      unit.name = name ?? unit.name;
      unit.blockNumber = blockNumber ?? unit.blockNumber;
      unit.unitType = unitType ?? unit.unitType;
      unit.landArea = req.body.landArea ?? unit.landArea;
      unit.siteplanSelector =
        siteplanSelector !== undefined
          ? siteplanSelector
          : unit.siteplanSelector;

      await unitRepository.save(unit);
      res.json(unit);
    } catch (error) {
      res.status(400).json({ message: "Error updating unit", error });
    }
  };
}
