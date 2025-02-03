import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { addCoupon, deleteCoupon, fetchCoupon, validateCoupon, } from "../controllers/coupon.controller.js";




const router = Router()

router.route('/add').post(verifyJWT, addCoupon)
router.route('/get').get(verifyJWT, fetchCoupon)
router.route('/delete/:id').delete(verifyJWT, deleteCoupon)
router.route('/validate').post(validateCoupon)



export default router