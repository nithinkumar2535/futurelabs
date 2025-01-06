import { Router } from "express";
import { getCurrentLocation, getPincode } from "../controllers/location.controller.js";




const router = Router()

router.route('/:pincode').get(getPincode)
router.route('/get-location').post(getCurrentLocation)



export default router