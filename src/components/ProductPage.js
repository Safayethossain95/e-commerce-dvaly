import React,{useState,useEffect,useReducer,useContext} from 'react';
import {Navbar,Container,Nav, Row, Col,Card,Button,Spinner,Modal,Badge,Form} from 'react-bootstrap'
import { Helmet } from 'react-helmet-async';
import axios from 'axios'
import { Store } from '../Store';
import {
    Link
  } from "react-router-dom";
import Rating from './Rating'

  function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return {...state,loading:true};
      case 'FETCH_SUCCESS':
        return {...state,loading:false,product:action.payload};
      case 'FETCH_FAILS':
        return {...state,loading:false,error:action.payload};
      default:
        return state
    }
  }

  
  const ProductPage = () => {
    
    const [{loading,error,product},dispatch] = useReducer(reducer,{
        loading:false,
        error:'',
        product:[]
      })

      const [details,setDetails] = useState({})
      const [lgShow, setLgShow] = useState(false);
      const [searchword,setSearchword] = useState("")
      

  useEffect(async()=>{
    dispatch({type:'FETCH_REQUEST'})
    try{
      let products = await axios.get("/products")
      dispatch({type:'FETCH_SUCCESS',payload:products.data})
      
    }catch(err){
      dispatch({type:'FETCH_FAILS',payload:err.message})
    }
  },[])

  const {state, dispatch:ctxDispatch,state2,dispatch2} = useContext(Store)

  const {cart:{cartItem},wishlist} = state

  const updateCart = (item,quantity) =>{
        ctxDispatch({
          type: 'CART_ADD_ITEM',
          payload:{
            ...item,
            quantity
          }
        })
      }
      let handleRemoveItem = (item)=>{
        ctxDispatch({
          type: 'CART_REMOVE_ITEM',
          payload: item
        })
      }
    
    let handleAddToCart= async(product)=>{
      const {cart} = state
      const existingItem = cart.cartItem.find((item)=> item._id == product._id)
      const quantity = existingItem ? existingItem.quantity + 1 : 1
      const {data} = await axios.get(`/cartproduct/${product._id}`)
      if(data.instock < quantity){
        window.alert(`${product.name} is out of stock`)
        return
      }
      ctxDispatch({
        type:"CART_ADD_ITEM",
        payload:{
          ...product,
          quantity
        }
      })
    }
    //================ wishlist
    let handleAddToWishlist= async(product)=>{
      
      dispatch2({
        type:"WISHLIST_ADD_ITEM",
        payload:{
          ...product
        }
      })
    }

    

    let handleModalShow = async(pro)=>{
      setLgShow(true)
      let productdetails = await axios.get(`/products/${pro}`)
      setDetails(productdetails.data)
      
    }

    let handleSearch=(e)=>{
      setSearchword(e.target.value)
    }

  return( 
  
  <>
  
  <Container>
    <Helmet>
      <title>Product page</title>
    </Helmet>

    <Container>
      <Row>
        <Col lg={6} className="m-auto mt-3 mb-3">
        <Form.Control onChange={handleSearch} type="text" placeholder="search your product" />
        </Col>
      </Row>
    </Container>
    
            <Row>
            
            {loading?
            <div className="spinnercener">
            <Spinner animation="border" />
            </div>
            
            :

            

            product.map((item)=>(

                  searchword?
                  
                  searchword==item.name.toLowerCase()?
                  <Col lg={3}>
                  <Card>
                      <Card.Img variant="top" src={item.img} />
                      <Card.Body>
                        <Card.Title>
                            <Link to={`/products/${item.slug}`}>{item.name} {item.bestsellerlimit>50? <Badge style={{marginLeft:"10px",color:"#000"}} bg="warning">Best Seller</Badge>:""}</Link>
                        </Card.Title>
                        <Card.Text>
                          <Rating rating={item.rating} numberofrating={item.numberofrating}></Rating>
                        </Card.Text>
                        
                        <Card.Text>
                          {item.description}
                        </Card.Text>
                        <Card.Text>
                          {item.price}$
                        </Card.Text>
                        
                        
                        {
                          item.instock == 0 ?
                          <>
                              <Button  className='mb-3 mt-3 me-1' variant="danger">Out of Stock</Button>
                          <Button onClick={() => handleModalShow(item.slug)}>Details</Button>
                          <Button onClick={() => handleAddToWishlist(item)}>Wishlist</Button>
                          <Modal
                              size="lg"
                              show={lgShow}
                              onHide={() => setLgShow(false)}
                              aria-labelledby="example-modal-sizes-title-lg"
                            >
                              <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                Product Details
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                              {details?
                               
                               
                               <Card style={{ width: '100%' }}>
                                      
                               <Card.Body>
                                 <Row>
                                   <Col lg={4}>
                                   <Card.Img variant="top" src={details.img} />
                                   </Col>
                                   <Col lg={8}>
                                   
                                   <Card.Title>{details.name}</Card.Title>
                                     <Card.Text>
                                       {details.description}
                                     </Card.Text>
                                     <Card.Text>
                                       <h4>${details.price}</h4>
                                     </Card.Text>
                                     {details.instock==0?
                                      <>
                                      <Button variant="danger">Out of Stock</Button> 
                                      <Button onClick={()=>handleAddToWishlist(details)} variant="primary">Add to Wishlist</Button>
                                      </>
                                      :
                                      <>
                                      <Button onClick={()=>handleAddToCart(details)} variant="primary">Add to Cart</Button>
                                      <Button onClick={()=>handleAddToWishlist(details)} variant="primary">Add to Wishlist</Button>
                                      </>
                                    }
                                
                                 
                                   </Col>
                                 </Row>
                               
                                  </Card.Body>
                             </Card>
                              :
                                <h1>
                                  Product Details Not Available
                                </h1>
                              }
                              </Modal.Body>
                            </Modal>
                          </>
                          :
                         <>
                           <Button  className='mb-3 mt-3 me-1' variant="primary" onClick={()=>handleAddToCart(item)}>Add to Cart</Button>
                          <Button onClick={() => handleModalShow(item.slug)}>Details</Button>
                          <Button onClick={() => handleAddToWishlist(item)}>Wishlist</Button>
                          
                         </>
                        }
                        
                        <br></br>
                        {cartItem.map(items=>(
                          item._id==items._id
                          ?
                            <>
                                <Button  style={{color:"#000",background:"#6C757D",border:"none",boxShadow:"none"}} onClick={()=>{updateCart(item,items.quantity-1)}} disabled={items.quantity == 1}>-</Button>
                                  {items.quantity}
                                <Button  style={{color:"#000",background:"#6C757D",border:"none",boxShadow:"none"}} onClick={()=>{updateCart(item,items.quantity+1)}} disabled={items.quantity == item.instock}>+</Button>
                                  <Button className='ms-3' onClick={()=>handleRemoveItem(item)} variant="danger">Delete</Button>
                                  
                                      
                    
                            </>
                          :
                          ""
                        ))}
                        
                        
                      </Card.Body>
                    </Card>
                    
                  </Col>
                  :
                  console.log("milenai")
                  
                  :

                  <Col lg={3}>
                  <Card>
                      <Card.Img variant="top" src={item.img} />
                      <Card.Body>
                        <Card.Title>
                            <Link to={`/products/${item.slug}`}>{item.name} {item.bestsellerlimit>50? <Badge style={{marginLeft:"10px",color:"#000"}} bg="warning">Best Seller</Badge>:""}</Link>
                        </Card.Title>
                        <Card.Text>
                          <Rating rating={item.rating} numberofrating={item.numberofrating}></Rating>
                        </Card.Text>
                        
                        <Card.Text>
                          {item.description}
                        </Card.Text>
                        <Card.Text>
                          {item.price}$
                        </Card.Text>
                        
                        
                        {
                          item.instock == 0 ?
                          <>
                              <Button  className='mb-3 mt-3 me-1' variant="danger">Out of Stock</Button>
                          <Button onClick={() => handleModalShow(item.slug)}>Details</Button>
                          <Button onClick={() => handleAddToWishlist(item)}>Wishlist</Button>
                          <Modal
                              size="lg"
                              show={lgShow}
                              onHide={() => setLgShow(false)}
                              aria-labelledby="example-modal-sizes-title-lg"
                            >
                              <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                Product Details
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                              {details?
                               
                               
                               <Card style={{ width: '100%' }}>
                                      
                               <Card.Body>
                                 <Row>
                                   <Col lg={4}>
                                   <Card.Img variant="top" src={details.img} />
                                   </Col>
                                   <Col lg={8}>
                                   
                                   <Card.Title>{details.name}</Card.Title>
                                     <Card.Text>
                                       {details.description}
                                     </Card.Text>
                                     <Card.Text>
                                       <h4>${details.price}</h4>
                                     </Card.Text>
                                     {details.instock==0?
                                      <>
                                      <Button variant="danger">Out of Stock</Button> 
                                      <Button onClick={()=>handleAddToWishlist(details)} variant="primary">Add to Wishlist</Button>
                                      </>
                                      :
                                      <>
                                      <Button onClick={()=>handleAddToCart(details)} variant="primary">Add to Cart</Button>
                                      <Button onClick={()=>handleAddToWishlist(details)} variant="primary">Add to Wishlist</Button>
                                      </>
                                    }
                                
                                 
                                   </Col>
                                 </Row>
                               
                                  </Card.Body>
                             </Card>
                              :
                                <h1>
                                  Product Details Not Available
                                </h1>
                              }
                              </Modal.Body>
                            </Modal>
                          </>
                          :
                         <>
                           <Button  className='mb-3 mt-3 me-1' variant="primary" onClick={()=>handleAddToCart(item)}>Add to Cart</Button>
                          <Button onClick={() => handleModalShow(item.slug)}>Details</Button>
                          <Button onClick={() => handleAddToWishlist(item)}>Wishlist</Button>
                          
                         </>
                        }
                        
                        <br></br>
                        {cartItem.map(items=>(
                          item._id==items._id
                          ?
                            <>
                                <Button  style={{color:"#000",background:"#6C757D",border:"none",boxShadow:"none"}} onClick={()=>{updateCart(item,items.quantity-1)}} disabled={items.quantity == 1}>-</Button>
                                  {items.quantity}
                                <Button  style={{color:"#000",background:"#6C757D",border:"none",boxShadow:"none"}} onClick={()=>{updateCart(item,items.quantity+1)}} disabled={items.quantity == item.instock}>+</Button>
                                  <Button className='ms-3' onClick={()=>handleRemoveItem(item)} variant="danger">Delete</Button>
                                  
                                      
                    
                            </>
                          :
                          ""
                        ))}
                        
                        
                      </Card.Body>
                    </Card>
                    
                  </Col>
                  
                  
            ))}
           
            </Row>
            
          </Container>

  </>);
};

export default ProductPage;
