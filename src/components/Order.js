import React,{useEffect} from 'react'
import { useReducer } from 'react';
import {Store} from '../Store'
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import {Alert,Container,Card} from 'react-bootstrap'
function reducer(state,action){
  switch(action.type){
    case "FETCH_REQUEST":
       return{ ...state,loading:true,error:''}
      
    case "FETCH_SUCCESS":{
      return {...state,loading:false,order:action.payload,error:''}
    }
    case "FETCH_FAIL":
      return {...state,loading:false,error:action.payload}
    default:
      return {...state}
  }
}

const Order = () => {


  const {state3} = useContext(Store)
  const {userInfo} = state3

  const params = useParams()
  const {id:orderID} = params 
  const navigate = useNavigate()

  const [{loading,error,order},dispatch] = useReducer(reducer,{
    loading:false,
    order:true,
    error:''
  })

  useEffect(()=>{
    console.log(orderID)
    if(!order._id || (order._id && order._id!==orderID)){
      const fetchorder = async()=>{
        try{
          dispatch({type:"FETCH_REQUEST"})
          const {data} = await axios.get(`/api/orders/${orderID}`,
          {
              headers:{
                  authorization: `Bearer ${userInfo.token}`
              }
          })

          dispatch({type:"FETCH_SUCCESS",payload:data})
        }catch(err){
          
          dispatch({type:"FETCH_FAIL",payload:err})
        }
      }
    }
  },[order,userInfo,navigate,orderID])
  return (
    <>
        {
          loading?
          <h1>loading....</h1>
          :
          error?
          <Alert variant="danger">
            <p>{error}</p>
          </Alert>
          :
          <Container>
            
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Order: {orderID}</Card.Title>
                <Card.Text>
                  {/* <b>Name: </b> {order.shippingAddress.fullname}<br></br>
                  <b>Addresss: </b> {order.shippingaddress.address}<br></br>
                  <b>Name: </b> {order.shippingAddress.country}<br></br> */}
                </Card.Text>                
              </Card.Body>
            </Card>
          </Container>
        }
    </>
  )
}

export default Order