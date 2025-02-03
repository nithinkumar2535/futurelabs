import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'



dotenv.config()

const app = express();




const corsOptions = {
  origin: process.env.CORS_ORIGINS.split(','), 
  credentials: process.env.CORS_CREDENTIALS === 'true', 
};

app.use(cors(corsOptions));





// common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static('uploads'))
app.use(cookieParser())


// import routes
import userRouter from './routes/user.route.js'
import mainBannerImageRouter from './routes/mainBannerImage.route.js'
import bottomBannerImageRouter from './routes/bottomBannerImage.route.js'
import testRouter from './routes/test.route.js'
import phoneRouter from './routes/phoneAuth.route.js'
import locationRouter from './routes/location.route.js'
import prescriptionRouter from './routes/prescription.route.js'
import cartRouter from './routes/cart.route.js'
import womenAgeRouter from './routes/womenAge.route.js'
import menAgeRouter from './routes/menAge.route.js'
import lifestyleRouter from './routes/lifeStyle.Route.js'
import LPMTRouter from './routes/LPMT.route.js'
import menPackageRouter from './routes/menPackage.route.js'
import organTestRouter from './routes/oraganTests.route.js'
import womenTestRouter from './routes/women.route.js'
import orderRouter from './routes/orders.router.js'
import couponRouter from './routes/coupon.route.js'


// routes
app.use('/api/v1/users',userRouter)
app.use('/api/v1/mainbanners', mainBannerImageRouter)
app.use('/api/v1/bottombanners', bottomBannerImageRouter)
app.use('/api/v1/tests', testRouter)
app.use('/api/v1/auth', phoneRouter)
app.use('/api/v1/location', locationRouter)
app.use('/api/v1/prescription', prescriptionRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/category/lessPrice', LPMTRouter)
app.use('/api/v1/category/womenage', womenAgeRouter)
app.use('/api/v1/category/menage', menAgeRouter)
app.use('/api/v1/category/lifestyle', lifestyleRouter)
app.use('/api/v1/category/men', menPackageRouter)
app.use('/api/v1/category/organ', organTestRouter)
app.use('/api/v1/category/women', womenTestRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/coupons', couponRouter)



export { app } 
