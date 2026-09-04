import { ProposalService } from '../services/proposalService.js';

export const listProposals = async (req, res, next) => {
  try {
    const proposals = await ProposalService.listProposals(req.userId, {
      clientId: req.query.clientId,
      status: req.query.status,
      search: req.query.search,
    });
    res.status(200).json({ success: true, data: proposals });
  } catch (error) {
    next(error);
  }
};

export const getProposalById = async (req, res, next) => {
  try {
    const proposal = await ProposalService.getProposalById(req.userId, req.params.id);
    res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
};

export const createProposal = async (req, res, next) => {
  try {
    const proposal = await ProposalService.createProposal(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Proposal created', data: proposal });
  } catch (error) {
    next(error);
  }
};

export const updateProposal = async (req, res, next) => {
  try {
    const proposal = await ProposalService.updateProposal(req.userId, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Proposal updated', data: proposal });
  } catch (error) {
    next(error);
  }
};

export const deleteProposal = async (req, res, next) => {
  try {
    const result = await ProposalService.deleteProposal(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
