import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addCategory, deleteCategory, getAllCategory, updateCategory, getSelectedCategories } from "../controllers/menAge.controller.js";


const router = Router()

router.route('/upload').post(verifyJWT, upload.single('imageFile'), addCategory)
router.route('/update/:id').patch(verifyJWT, updateCategory)
router.route('/delete/:id').delete(verifyJWT, deleteCategory)
router.route('/get').get(verifyJWT, getAllCategory)
router.route('/selected').get(getSelectedCategories)





export default router



