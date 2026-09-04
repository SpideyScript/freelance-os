import { ProjectService } from '../services/projectService.js';

export const listProjects = async (req, res, next) => {
  try {
    const projects = await ProjectService.listProjects(req.userId, {
      clientId: req.query.clientId,
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
    });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const result = await ProjectService.getProjectById(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await ProjectService.createProject(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await ProjectService.updateProject(req.userId, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Project updated', data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const result = await ProjectService.deleteProject(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
