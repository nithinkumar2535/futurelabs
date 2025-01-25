import { Cart } from '../models/cart.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse} from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'


const addToCart = asyncHandler (async (req, res) => {
    const { userId, testId, quantity} = req.body
    console.log(req.body);
    

    let cartItem = await Cart.findOne({ userId, testId})


    if(cartItem) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Product already in cart"))
    }

    const newCartItem = new Cart({ userId, testId, quantity})
    await newCartItem.save()
    console.log("item added to cart");
    

    const existingCart = await Cart.find({userId})

    if (!existingCart) {
        throw new ApiError(500, "Something went wrong while adding to the cart")
    }

    return res
        .status(201)
        .json( new ApiResponse(201, existingCart, "test added to cart"))


})

const getCartItems = asyncHandler( async (req, res) => {
    const { userId } = req.params

    if (! userId ) {
        throw new ApiError(400, "User not found")
    }

    const cartItems = await Cart.find({userId})

    if(!cartItems) {
        throw new ApiError(404, "Something went wrong while fetching the cart")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cartItems, "Cart items"))     
})

const removeItem = asyncHandler( async (req, res) => {
    const {userId, testId} = req.body
    
    if(!userId || !testId) {
        throw new ApiError(404, "UserId and testId required")
    }

    await Cart.findOneAndDelete({userId, testId})

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Item removed from cart"))
})

const updateItemQuantity = asyncHandler (async (req, res) => {
    const {userId, testId, quantity} = req.body
    

    const cartItem = await Cart.findOne({userId, testId})

    if (!cartItem) {
        throw new ApiError(400, "Item not found in cart")
    }

    cartItem.quantity = quantity
    await cartItem.save()

    return res
        .status(200)
        .json(new ApiResponse(200, cartItem, "Itme quantity updated"))
})

const clearCart = asyncHandler( async (req, res) => {
    const {userId} = req.params

    await Cart.deleteMany({userId})

    return res
        .status(200)
        .json( new ApiResponse (200, null, "Cart cleared"))
})


export {
    addToCart,
    getCartItems,
    removeItem,
    updateItemQuantity,
    clearCart
}