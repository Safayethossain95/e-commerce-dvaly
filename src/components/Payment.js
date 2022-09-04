import React,{useState,useContext} from 'react'
import {Container,Alert,Form,Button} from 'react-bootstrap'
import CheckoutStep from './CheckoutStep'
import { Link } from 'react-router-dom'
import {Store} from '../Store'
const Payment = () => {
    const {state5,dispatch5} = useContext(Store)
    
    const [paymentMethod,setPaymentmethod] = useState(state5.paymentInfo.paymentMethod || "")


    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log(paymentMethod)
        dispatch5({
            type:"PAYMENT_INFO",
            payload:{
                paymentMethod
            }
        })

        localStorage.setItem("paymentInfo",JSON.stringify({
            paymentMethod
        }))
    }
  return (
    <>
            <CheckoutStep step1="true" step2="true" step3="true" />

            

            <Container className='w-25 border p-3 mt-3'>
                <Link to='/shipping'>
                    <Button className="w-100 mb-3" variant="primary">Return To Shipping Page</Button>
                </Link>

                <Alert variant="primary">
                    Choose Payment Method
                </Alert>
                <Form onSubmit={handleSubmit}>
                    <Form.Check value="Paypal" checked={paymentMethod == "Paypal"} onChange={e=>setPaymentmethod(e.target.value)} type="radio" label="Paypal" />
                    <Form.Check value="Stripe" checked={paymentMethod == "Stripe"} onChange={e=>setPaymentmethod(e.target.value)} type="radio" label="Strip" />
                    <Form.Check value="SSLCommerz" checked={paymentMethod == "SSLCommerz"} onChange={e=>setPaymentmethod(e.target.value)} type="radio" label="SSLCommerz" />
                    <Link to="/placeorder"><Button type="submit">Continue</Button></Link>
                </Form>
            </Container>
    </>
  )
}

export default Payment