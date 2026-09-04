import { TimeService } from '../services/timeService.js';

export const listTimeEntries = async (req, res, next) => {
  try {
    const entries = await TimeService.listTimeEntries(req.userId, {
      projectId: req.query.projectId,
      taskId: req.query.taskId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });
    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
};

export const getActiveTimer = async (req, res, next) => {
  try {
    const active = await TimeService.getActiveTimer(req.userId);
    res.status(200).json({ success: true, data: active });
  } catch (error) {
    next(error);
  }
};

export const startTimer = async (req, res, next) => {
  try {
    const entry = await TimeService.startTimer(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Timer started', data: entry });
  } catch (error) {
    next(error);
  }
};

export const stopTimer = async (req, res, next) => {
  try {
    const entry = await TimeService.stopTimer(req.userId, req.body);
    res.status(200).json({ success: true, message: 'Timer stopped', data: entry });
  } catch (error) {
    next(error);
  }
};

export const logManualTime = async (req, res, next) => {
  try {
    const entry = await TimeService.logManualTime(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Time logged manually', data: entry });
  } catch (error) {
    next(error);
  }
};

export const deleteTimeEntry = async (req, res, next) => {
  try {
    const result = await TimeService.deleteTimeEntry(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
