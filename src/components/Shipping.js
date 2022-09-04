import React,{useEffect} from 'react'
import { Button,Container,Form,Alert } from 'react-bootstrap'
import CheckoutStep from './CheckoutStep';
import { Helmet } from 'react-helmet-async'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Store} from '../Store'
import { useContext } from 'react';
export const Shipping = () => {

    const navigate = useNavigate()
    const {state4,dispatch4} = useContext(Store)
    const {state3} = useContext(Store)
    const {userInfo} = state3
    const [fullname,setFullname] = useState(state4.shippingInfo.fullname || "")
    const [address,setAddress] = useState(state4.shippingInfo.address || "")
    const [city,setCity] = useState(state4.shippingInfo.city || "")
    const [postcode,setPostcode] = useState(state4.shippingInfo.postcode || "")
    const [country,setCountry] = useState(state4.shippingInfo.country || "")
    console.log(state4.shippingInfo)
    const handleSubmit=(e)=>{
        e.preventDefault()

        dispatch4({
            type:"SHIPPING_INFO",
            payload:{
                fullname,
                address,
                city,
                postcode,
                country
            }
        })

        localStorage.setItem("shippingInfo",JSON.stringify({
            fullname,
            address,
            city,
            postcode,
            country
        }))

        navigate("/payment")
    }
    useEffect(()=>{
        
        if(!userInfo){
            navigate('/signin?redirect=/shipping')
        }
    
    },[])
  return (
    <>
    <Helmet>
        <title>Shipping Page</title>
    </Helmet>

    <CheckoutStep step1="true" step2="true" />
    

    <Container className="w-25 border mt-5 p-3">
        <Form onSubmit={handleSubmit}>
            <Alert variant="info">
                <Alert.Heading>Shipping Address</Alert.Heading>
            </Alert>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={fullname} onChange={(e)=>setFullname(e.target.value)} type="text" placeholder="Enter Full Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Address</Form.Label>
                <Form.Control value={address} onChange={(e)=>setAddress(e.target.value)} type="text" placeholder="Address" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>City</Form.Label>
                <Form.Control value={city} onChange={(e)=>setCity(e.target.value)} type="text" placeholder="Enter City" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control value={postcode} onChange={(e)=>setPostcode(e.target.value)} type="text" placeholder="Post Code" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Country</Form.Label>
                <Form.Control value={country} onChange={(e)=>setCountry(e.target.value)} type="text" placeholder="Enter your country" />
            </Form.Group>
            <Button type="submit">Continue</Button>
        </Form>
    </Container>
    </>
  )
}
