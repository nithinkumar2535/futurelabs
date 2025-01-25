import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { addToCart, clearCart, getCartItems, removeItem, updateItemQuantity } from "../controllers/cart.controller.js";



const router = Router()

router.route('/add').post(addToCart)
router.route('/get/:userId').get(getCartItems)
router.route('/remove-item').delete(removeItem)
router.route('/update').put(updateItemQuantity)
router.route('/delete/:id').delete(clearCart)



export default router