import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { addToCart, clearCart, getCartItems, removeItem, updateItemQuantity } from "../controllers/cart.controller.js";



const router = Router()

router.route('/add').post(verifyJWT, addToCart)
router.route('/').get(verifyJWT, getCartItems)
router.route('/:productId').delete(verifyJWT, removeItem)
router.route('/:productId').put(verifyJWT, updateItemQuantity)
router.route('/delete').delete(verifyJWT, clearCart)



export default router