import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deletePrescription, fetchPrescription, uploadPrescription } from "../controllers/prescription.controller.js";


const router = Router()

router.route('/upload').post( upload.single("prescription"), uploadPrescription)
router.route('/delete/:id').delete(verifyJWT, deletePrescription)
router.route('/get').get(verifyJWT, fetchPrescription)





export default router