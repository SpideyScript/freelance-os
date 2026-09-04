import { AnalyticsService } from '../services/analyticsService.js';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const metrics = await AnalyticsService.getDashboardMetrics(req.userId);
    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

export const getFinancialReport = async (req, res, next) => {
  try {
    const report = await AnalyticsService.getFinancialReport(req.userId);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
