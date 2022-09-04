import React,{useContext,useEffect,useReducer,useState} from 'react'
import { Helmet } from 'react-helmet-async';
import { Container,Table,Col,Row,Alert, Button,Form } from 'react-bootstrap';
import {Store} from '../Store'
import {Link, useNavigate} from 'react-router-dom'
import Carts from './Cart';
import { axios } from 'axios';
 const Cart = () => {

  
  const navigate = useNavigate();
  
  const {state,dispatch} = useContext(Store) 
  const {cart:{cartItem}} = state
  const updateCart = (item,quantity) =>{
    dispatch({
      type: 'CART_ADD_ITEM',
      payload:{
        ...item,
        quantity
      }
    })
  }
  let handleRemoveItem = (item)=>{
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item
    })
  }
  useEffect(()=>{
    console.log(cartItem)
  })

  const [couponcal,setCouponcal] = useState("")
  const [couponvalue,setCouponvalue] = useState("")
  const [additionarr,setAdditionarr] = useState([])
  const handleCoupon=()=>{
    
    cartItem.map(product=>{
      if(couponvalue==product.couponcode){
      let calculation = ( product.price * product.discount)/100
      let aftercal = product.price - calculation
      
      setCouponcal(aftercal)
      additionarr.push(aftercal)
      additionarr.map((accumulator,current)=> accumulator + current, 0 ) 
    }else{
      setCouponcal(product.price)
    }
    })

    
    
 
  }
  const handleAfterCoupon=(e)=>{
    if(e.target.value.length>0){
      setCouponvalue(e.target.value)
    }
    else{
      setCouponvalue("")
    }
      
    
  }



  let handleCheckOut = () =>{
    navigate('/signin?redirect=/shipping')
  }

  
  return (
    <Container>
    <Helmet>
      <title>Cart Page</title>
    </Helmet>
    <h1>
      Shopping Cart
    </h1>
    <Row>
      <Col lg={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
               
                <th>Product image</th>
                <th>Prouduct Name</th>
                <th>Product price</th>
              
              </tr>
            </thead>
            <tbody>
              
              
                
                  {cartItem.length<=0? 
                  <tr>
                      <td>
                  
                     <h2>cart is empty</h2>
                
                   </td>
                  </tr>
                  
                  :
               
                 <>
                 
                  {cartItem.map((item=>(
                    <>
                    <tr>
                    <td>
                      <img width="70" src={item.img} alt="" />
                    </td>
                    <td>
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </td>
                    <td>
                      <Button onClick={()=>{updateCart(item,item.quantity-1)}} disabled={item.quantity == 1}>-</Button>
                      {item.quantity}
                      <Button onClick={()=>{updateCart(item,item.quantity+1)}} disabled={item.quantity == item.instock}>+</Button>
                    </td>
                    <td>
                      <Button onClick={()=>handleRemoveItem(item)} variant="danger">Delete</Button>
                    </td>
                    </tr>
                    
                  </>
                  )))}
                 </>
                  

                }
                
               
              
              
            
            </tbody>
         </Table>
      </Col>
      <Col lg={4}>
        <h1>Total <span>{cartItem.reduce((accumulator,current)=> accumulator + current.quantity , 0)}</span></h1>
        
        <h3>Price <span>{additionarr.length>0? 
        <del>${cartItem.reduce((accumulator,current)=> accumulator + current.price * current.quantity, 0 )}</del>
        :
        <span>${cartItem.reduce((accumulator,current)=> accumulator + current.price * current.quantity, 0 )}</span> }</span></h3>
        <Form.Control onChange={handleAfterCoupon} type="text" placeholder="Eid2022" />
        <Button onClick={handleCoupon} className="mt-2" variant="info">Apply</Button>
        <h1>{additionarr?additionarr.reduce((accumulator,current)=> accumulator + current, 0 ):""}</h1>
        <Button onClick={handleCheckOut} variant="success" className="w-100">Payment</Button>
      </Col>
    </Row>
   
    </Container>
  )
}

export default Cart