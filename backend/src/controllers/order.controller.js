
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse} from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { Order } from '../models/order.model.js'
import { Cart } from '../models/cart.model.js'
import { sendEmail } from "../utils/emailService.js";


const addToOrders = asyncHandler(async (req, res) => {
    const { userId, items, totalAmount, name, phoneNumber, address, pincode, addressType } = req.body;

    // Validate required fields
    if (!userId || !items || !totalAmount || !name || !phoneNumber || !address || !pincode || !addressType) {
        throw new ApiError(404, "All fields are required");
    }

    // Create a new order
    const newOrder = new Order({
        userId,
        items,
        totalAmount,
        name,
        phoneNumber,
        address,
        pincode,
        addressType,
    });

    await newOrder.save();

    const order = await Order.findById(newOrder._id)
    .populate({
      path: 'items.testId',
      select: 'testName offerPrice category', // Populate specific fields
    })

    console.log(order.items);
    

    
    if (!order) {
        throw new ApiError(400, "Something went wrong while placing the order");
    }

    // Clear the cart
    await Cart.deleteMany({ userId });
   
    

    // Prepare email details
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ADMIN, // Admin email
        subject: 'New Order Received',
        html: `
            <h1>New Order Details</h1>
            <p>A new order has been placed by ${name}.</p>
            <ul>
                <li><strong>Order ID:</strong> ${order._id}</li>
                <li><strong>User Name:</strong> ${name}</li>
                <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                <li><strong>Total Amount:</strong> ₹${totalAmount}</li>
                <li><strong>Shipping Address:</strong> ${address}, ${pincode}, ${addressType}</li>
                <li><strong>Items:</strong></li>
                <ul>
                    ${order.items
                        .map(
                            (item) =>
                                `<li>${item.testId.testName} - Quantity: ${item.quantity} - Price: ₹${item.testId.offerPrice}</li>`
                        )
                        .join('')}
                </ul>
            </ul>
        `,
    };

    try {
        // Send email to admin
        const response = await sendEmail(mailOptions);
        console.log('Email sent:', response);
    } catch (err) {
        console.error('Error sending email:', err);
        // Log the error but do not stop order placement
    }

    // Return success response
    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order placed successfully. Email notification sent to admin."));
});


const getOrders = asyncHandler( async (req, res) => {
   

    const orders = await Order.find()

    if (!orders) {
        throw new ApiError(404, "Order not found");
    }
    

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders"))     
})

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id)
    .populate({
      path: 'items.testId',
      select: 'testName offerPrice category', // Populate specific fields
    })

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order details fetched successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        throw new ApiError(404, "Order not found or already deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Order deleted successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(status);
    

    const validStatuses = ['Pending', 'Completed', 'Canceled'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid order status");
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.status = status;
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, `Order status updated to ${status}`));
});



export {
    addToOrders,
    getOrders,
    getOrderById,
    deleteOrder,
    updateOrderStatus,
}