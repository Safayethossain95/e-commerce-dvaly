import React,{useContext,useState,useEffect} from 'react'
import {Container,Row,Col,Card,Button,ListGroup,Modal,Form,Alert} from 'react-bootstrap'
import { Store } from './../Store';
import CheckoutStep from './CheckoutStep'
import { useReducer } from 'react';
import {toast} from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Placeorder = () => {
    
    const navigate = useNavigate()
    const reducer = (state,action)=>{
        switch(action.type){
            case "CREATE_REQUEST":
                return {
                    ...state,
                    loading:true
                }
            case "CREATE_SUCCESS":
                return {
                    ...state,
                    loading:false
                }

            case "CREATE_FAIL":
                return{
                    ...state,
                    loading:false
                }
            default:
                return{
                    ...state
                }
        }
    }

    const [{loading},dispatch] = useReducer(reducer,{
        loading:false
    })

    const {state,dispatch:ctxDispatch,state3,state4,dispatch4,state5,dispatch5} = useContext(Store)
    const {userInfo} = state3
    
    

    const [fullname,setFullname] = useState(state4.shippingInfo.fullname || "")
    const [address,setAddress] = useState(state4.shippingInfo.address || "")
    const [city,setCity] = useState(state4.shippingInfo.city || "")
    const [postcode,setPostcode] = useState(state4.shippingInfo.postcode || "")
    const [country,setCountry] = useState(state4.shippingInfo.country || "")
    const [paymentMethod,setPaymentmethod] = useState(state5.paymentInfo.paymentMethod || "")
    const [total,setTotal] = useState("")
    const [tax,setTax] = useState("")
    const [delivarycharge,setDelivarycharge] = useState("")

    useEffect(()=>{
        let total = state.cart.cartItem.reduce((accumulator,current)=> accumulator + current.price * current.quantity, 0 )
        setTotal(total)
        let temptax = total>500? (total*20)/100 : 0
        setTax(temptax)

        if(total>500){
            const dc = (total*3)/100
            setDelivarycharge(dc)
        }else{
            setDelivarycharge(0)
        }
        

    },[state.cart.cartItem])


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show2, setShow2] = useState(false);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);


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

        setShow(false)
    }
    const handleSubmit2 = (e)=>{
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

        setShow2(false)
    }
    const handlePlaceorder = async() =>{
        
        try{

            const {data} = await axios.post('/api/orders',{
                orderItems: state.cart.cartItem,
                shippingaddress: state4.shippingInfo,
                paymentMethod: state5.paymentInfo.paymentMethod,
                shippingPrice:delivarycharge,
                productPrice:total,
                taxPrice:tax,                
                totalPrice:total + tax + delivarycharge,
                
                
            },
            {
                headers:{
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            
            ctxDispatch({type:"CLEAR_CART"})
            dispatch({type:"CREATE_SUCCESS"})
            navigate(`/orders/${data.order._id}`)
            
            
        }catch(err){
            dispatch({type:"CREATE_FAIL"})
            toast.error(err)
        }
        
    }
  return (
    <>
        <Container>
            
            <CheckoutStep step1="true" step2="true" step3="true" step4="true" />
            <h3 className='mt-3'>Preview Order</h3>
            <Row>

                <Col lg={8}>
                <Card className="mt-3">
                
                <Card.Body>
                    <Card.Title>Shipping Details</Card.Title>
                    <hr/>
                    <Card.Text>
                   
                    <ListGroup>
                    <ListGroup.Item><b>Fullname: </b> {state4.shippingInfo.fullname}</ListGroup.Item>
                    <ListGroup.Item><b>Address: </b>{state4.shippingInfo.address}</ListGroup.Item>
                    <ListGroup.Item><b>City: </b>{state4.shippingInfo.city}</ListGroup.Item>
                    <ListGroup.Item><b>Postcode: </b>{state4.shippingInfo.postcode}</ListGroup.Item>
                    <ListGroup.Item><b>Country: </b>{state4.shippingInfo.country}</ListGroup.Item>
                    </ListGroup>
                    </Card.Text>
                    <Button onClick={handleShow} variant="primary">Edit shipping info</Button>
                </Card.Body>
                </Card>

                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>Payment Method</Card.Title>
                        <hr/>
                        <Card.Text>
                    
                        <ListGroup>
                        <ListGroup.Item><b>Payment Method: </b> {state5.paymentInfo.paymentMethod}</ListGroup.Item>
                        
                        </ListGroup>
                        </Card.Text>
                        <Button onClick={handleShow2} variant="primary">Edit payment method</Button>
                    </Card.Body>
                </Card>
                
                <Card className="mt-5">
                    <Card.Body>
                        <Card.Title>Ordered Items</Card.Title>
                        <hr/>
                        <Card.Text>
                    
                        <ListGroup>
                        <ListGroup.Item><b>Total Items: </b> {state.cart.cartItem.length}</ListGroup.Item>
                        
                        </ListGroup>
                        <ListGroup>
                                {state.cart.cartItem.map(item=>(
                                    <ListGroup.Item>
                                        <img style={{width:"40px",marginRight:"15px"}} src={item.img} alt="myimg"/>
                                         {item.name}
                                         <b style={{marginLeft:"15px"}}>quantity:</b> 
                                         {item.quantity}
                                    </ListGroup.Item>
                                )
                                    )}
                        </ListGroup>
                        </Card.Text>
                        <Button onClick={handleShow2} variant="primary">Edit payment method</Button>
                    </Card.Body>
                </Card>
                
                </Col>
                <Col lg={4}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>Place Order</Card.Title>
                            <hr/>
                            <Card.Text>
                        
                            <ListGroup>

                            <ListGroup.Item><b>Product Price: </b>${total}</ListGroup.Item>
                            <ListGroup.Item><b>Delivary Charge: </b>${delivarycharge}</ListGroup.Item>
                            <ListGroup.Item><b>Tax: </b> ${tax}</ListGroup.Item>
                            <ListGroup.Item><b>Total: </b>${total + tax + delivarycharge }</ListGroup.Item>
                            
                            </ListGroup>
                            </Card.Text>
                            <Button onClick={handlePlaceorder} variant="primary">Place Order</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
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
                
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                Continue
            </Button>
            </Modal.Footer>
        </Modal>

       

        <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <Alert variant="primary">
                    Choose Payment Method
                </Alert>
                <Form onSubmit={handleSubmit2}>
                    <Form.Check value="Paypal" checked={paymentMethod == "Paypal"} onChange={e=>setPaymentmethod(e.target.value)} type="radio" label="Paypal" />
                    <Form.Check value="Stripe" checked={paymentMethod == "Stripe"} onChange={e=>setPaymentmethod(e.target.value)} type="radio" label="Strip" />
                    <Form.Check value="SSLCommerz" checked={paymentMethod == "SSLCommerz"} onChange={e=>setPaymentmethod(e.target.value)} type="radio" label="SSLCommerz" />
                    
                </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit2}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Placeorder