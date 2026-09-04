import { TaskService } from '../services/taskService.js';

export const listTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.listTasks(req.userId, {
      projectId: req.query.projectId,
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
    });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await TaskService.createTask(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.userId, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Task updated', data: task });
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (req, res, next) => {
  try {
    const result = await TaskService.reorderTasks(req.userId, req.body.tasks);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await TaskService.deleteTask(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
