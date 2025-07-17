import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/order.controller.js';
import isAuthenticated from '../middlewares/authenticate.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.post('/', isAuthenticated, createOrder);
router.get('/my-orders', isAuthenticated, getUserOrders);
router.get('/:id', isAuthenticated, getOrderById);
router.patch('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);
router.get('/', isAuthenticated, isAdmin, getAllOrders);

export default router;
