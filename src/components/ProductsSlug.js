import React, { useState, useContext, useEffect, useReducer } from "react"
import { Routes, Route, useParams } from "react-router-dom"
import {
  Navbar,
  Container,
  Nav,
  Row,
  Col,
  Card,
  Button,
  Alert,
  ListGroup,
  Badge,
  Form
} from "react-bootstrap"
import Slider from "react-slick";
import { useNavigate } from "react-router-dom"
import Rating from "./Rating"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import ReactDOM from "react-dom"
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css"
import InnerImageZoom from "react-inner-image-zoom"
import { Store } from "./../Store"
import { FaArrowRight,FaArrowLeft } from "react-icons/fa";
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload }
    case "FETCH_FAILS":
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const ProductsSlug = () => {

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow:<FaArrowRight className="next"/>,
    prevArrow:<FaArrowLeft className="prev"/>
  };
  let params = useParams()
  const navigate = useNavigate()
  const [relatedproduct,setRelatedproduct] = useState([])
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    product: {},
  })

  const [couponcal,setCouponcal] = useState("")
  const [couponvalue,setCouponvalue] = useState("")
  const handleCoupon=()=>{
    if(couponvalue==product.couponcode){
      let calculation = ( product.price * product.discount)/100
      let aftercal = product.price - calculation
      console.log(aftercal)
      setCouponcal(aftercal)
    }else{
      setCouponcal(product.price)
    }
  }
  const handleAfterCoupon=(e)=>{
    if(e.target.value.length>0){
      setCouponvalue(e.target.value)
    }
    else{
      setCouponvalue("")
    }
      
    
  }

  useEffect(async() => {
    dispatch({ type: "FETCH_REQUEST" })
    try {
      let products = await axios.get(`/products/${params.slug}`)
      // console.log(products)
      dispatch({ type: "FETCH_SUCCESS", payload: products.data })

      let relateddata = await axios.get("/products")
      
      // products2.data.map(item=>{
      //   if(item.category==products.data.category && item.name !== products.data.name){
      //     setRelatedproduct(item.name)
      //   }
      // })
      let filterdata = relateddata.data.filter(item=>(item.category==products.data.category && item.name !== products.data.name))
      setRelatedproduct(filterdata)
    } catch (err) {
      dispatch({ type: "FETCH_FAILS", payload: err.message })
    }
  }, [params.slug])



  const { state, dispatch: ctxDispatch } = useContext(Store)
  const [couponvariable,setCouponvariable ] = useState("")

  let handleAddToCart = async () => {
    const { cart } = state
    const existingItem = cart.cartItem.find((item) => item._id == product._id)
    const quantity = existingItem ? existingItem.quantity + 1 : 1
    const { data } = await axios.get(`/cartproduct/${product._id}`)
    if (data.instock < quantity) {
      window.alert(`${product.name} is out of stock`)
      return
    }
    
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: {
          ...product,
          quantity,
          price:couponcal?couponcal:product.price
        },
      })
    
    
    
    navigate("/cart")
  }
  return (
    <>
      {/* <h1>{params.slug}</h1> */}
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Container>
        <Row>
          {product ? (
            <>
              <Col lg={6}>
                {/* <img className="w-100" src={product.img}></img> */}
                {product.img && (
                  <InnerImageZoom
                    height="500"
                    src={product.img}
                    zoomSrc={product.img}
                  />
                )}
              </Col>
              <Col lg={3}>
                <Card style={{ width: "18rem" }}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>{product.name}</ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        rating={product.rating}
                        numberofrating={product.numberofrating}
                      ></Rating>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Quantity Available{" "}
                      {product.instock > 0 ? (
                        <Badge bg="success">{product.instock}</Badge>
                      ) : (
                        <Badge bg="danger">{product.instock}</Badge>
                      )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <h3>${product.price}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>{product.description}</ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
              
              <Col lg={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    {couponcal?
                    <h3>Price <del>${product.price}</del></h3>
                    :  
                    <h3>Price ${product.price}</h3>
                    }
                    
                  </ListGroup.Item>
                  <ListGroup.Item>
                  <Form.Group className="mb-3">
                    <Form.Label>Add Coupon</Form.Label>
                    <br/>
                    {couponcal?
                    <Form.Label><h5>After coupon ${couponcal}</h5></Form.Label>
                    :
                    ""
                    }
                    
                    <Form.Control onChange={handleAfterCoupon} type="text" placeholder="Eid2022" />
                    <Button onClick={handleCoupon} className="mt-2" variant="info">Apply</Button>
                  </Form.Group>
                    <h3>${product.price}</h3>
                  </ListGroup.Item>
                  <Button className="mb-3" onClick={handleAddToCart} variant="primary">
                    Add to Cart
                  </Button>
                </ListGroup>
              </Card>
              </Col>
            </>
          ) : (
            <Alert variant="danger">
              <h3>Ei naam e kono product nai</h3>
            </Alert>
          )}
        </Row>
        <Row>
          <Col lg={12}>

            {
              relatedproduct.length > 0 ?
              <Row>
                <Slider {...settings}>
               { relatedproduct.map(item=>(
                <Col lg={3}>
                    <Card className="p-2" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={item.img} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                      <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              </Slider>
              </Row>
              :
             <>
              <Alert variant="danger">
                <h3>No Related Product</h3>
              </Alert>
             </>
              
            }
            
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ProductsSlug
