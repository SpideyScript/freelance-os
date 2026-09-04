import { AIService } from '../services/aiService.js';

export const generateProposal = async (req, res, next) => {
  try {
    const proposal = await AIService.generateProposal(req.userId, req.body);
    res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
};

export const generateMessage = async (req, res, next) => {
  try {
    const message = await AIService.generateMessage(req.userId, req.body);
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const generateProjectPlan = async (req, res, next) => {
  try {
    const plan = await AIService.generateProjectPlan(req.userId, req.body);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const prioritizeTasks = async (req, res, next) => {
  try {
    const result = await AIService.prioritizeTasks(req.userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const generateInvoiceReminder = async (req, res, next) => {
  try {
    const reminder = await AIService.generateInvoiceReminder(req.userId, req.body);
    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

export const summarizeMeeting = async (req, res, next) => {
  try {
    const summary = await AIService.summarizeMeeting(req.userId, req.body);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

export const getBusinessAdvisor = async (req, res, next) => {
  try {
    const advice = await AIService.getBusinessAdvisor(req.userId);
    res.status(200).json({ success: true, data: advice });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const result = await AIService.chat(req.userId, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
