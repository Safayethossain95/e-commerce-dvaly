import { createContext,useReducer } from "react";

export const Store = createContext()


const initialState= {
    cart:{
        cartItem: localStorage.getItem("cartItem") ? JSON.parse(localStorage.getItem("cartItem")) : []
    }
}
const initialState2= {
    wishlist:{
        wishlistItem: localStorage.getItem("wishlistItem") ? JSON.parse(localStorage.getItem("wishlistItem")) : []
    }
}


const userinitialState= {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
}




function reducer (state,action){
    switch (action.type){
  
    case 'CART_ADD_ITEM':
        const newItem = action.payload 
        const existingItem = state.cart.cartItem.find((item)=> item._id == newItem._id)
        const cartItem = existingItem ? state.cart.cartItem.map((item)=>item._id == existingItem._id? newItem : item) 
        : 
        [...state.cart.cartItem,newItem]
        localStorage.setItem("cartItem", JSON.stringify(cartItem))
        return {
            ...state,
            cart:{
                ...state.cart,
                cartItem
            }
        }

    case 'CLEAR_CART':
        {
            return {
                ...state,
                cart:{
                    ...state.cart,
                    cartItem:[]
                }
            }
        }
    case 'CART_REMOVE_ITEM':
        {const cartItem = state.cart.cartItem.filter((item)=>item._id !== action.payload._id)
            localStorage.setItem("cartItem", JSON.stringify(cartItem))
        return {
            ...state,
            cart:{
                ...state.cart,
                cartItem
            }
        }}
            default:
                return state
    }
}

// ==============================

function reducer2 (state,action){
    switch (action.type){
    case 'WISHLIST_ADD_ITEM':
        const newItem = action.payload 
        const existingItem = state.wishlist.wishlistItem.find((item)=> item._id == newItem._id)
        const wishlistItem = existingItem ? state.wishlist.wishlistItem.map((item)=>item._id == existingItem._id? newItem : item) 
        : 
        [...state.wishlist.wishlistItem,newItem]
        localStorage.setItem("wishlistItem", JSON.stringify(wishlistItem))
        return {
            ...state,
            wishlist:{
                ...state.wishlist,
                wishlistItem
            }
        }

    case 'WISHLIST_REMOVE_ITEM':
        {const wishlistItem = state.wishlist.wishlistItem.filter((item)=>item._id !== action.payload._id)
            localStorage.setItem("wishlistItem", JSON.stringify(wishlistItem))
        return {
            ...state,
            wishlist:{
                ...state.wishlist,
                wishlistItem
            }
        }}
            default:
                return state
    }
}

// =======================

function userReducer (state,action){
    switch (action.type){
  
    case 'USER_SIGNIN':
        
        return {
            ...state,
            userInfo: action.payload
        }
    case 'USER_LOGOUT':
        return{
            ...state,
            userInfo:null
        }
    default:
                return state
    }
}

// ===========================

const shippinginitialState= {
    shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {}
}

function shippingReducer (state,action){
    switch (action.type){
  
    case 'SHIPPING_INFO':
        return {
            ...state,
            shippingInfo: action.payload
        }
   
    default:
                return state
    }
}

// ==================

const paymentinitialState= {
    paymentInfo: localStorage.getItem("paymentInfo") ? JSON.parse(localStorage.getItem("paymentInfo")) : {}
}

function paymentReducer (state,action){
    switch (action.type){
  
    case 'PAYMENT_INFO':
        return {
            ...state,
            paymentInfo: action.payload
        }
   
    default:
                return state
    }
}

export function StoreProvider(props){
    const [state,dispatch] = useReducer(reducer,initialState)

    const [state2,dispatch2] = useReducer(reducer2,initialState2)

    const [state3,dispatch3] = useReducer(userReducer,userinitialState)
    
    const [state4,dispatch4] = useReducer(shippingReducer,shippinginitialState)
    
    const [state5,dispatch5] = useReducer(paymentReducer,paymentinitialState)

    const value = {state, dispatch,state2,dispatch2,state3,dispatch3,state4,dispatch4,state5,dispatch5}

    return <Store.Provider value={value}>{props.children}</Store.Provider>
}