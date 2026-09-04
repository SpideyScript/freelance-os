import { ClientService } from '../services/clientService.js';

export const listClients = async (req, res, next) => {
  try {
    const result = await ClientService.listClients(req.userId, {
      search: req.query.search,
      status: req.query.status,
      tag: req.query.tag,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 50,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const result = await ClientService.getClientById(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req, res, next) => {
  try {
    const client = await ClientService.createClient(req.userId, req.body);
    res.status(201).json({ success: true, message: 'Client created', data: client });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await ClientService.updateClient(req.userId, req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Client updated', data: client });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const result = await ClientService.deleteClient(req.userId, req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
