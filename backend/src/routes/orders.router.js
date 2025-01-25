import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { addToOrders, deleteOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order.controller.js";




const router = Router()

router.route('/add').post(addToOrders)
router.route('/get').get(verifyJWT, getOrders)
router.route('/get/:id').get(verifyJWT, getOrderById)
router.route('/delete/:id').delete(verifyJWT, deleteOrder)
router.route('/update/:id').put(updateOrderStatus)




export default router