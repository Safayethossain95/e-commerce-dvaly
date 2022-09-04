import React, { useEffect, useReducer, useState } from "react"
import axios from "axios"
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Card,
  Button,
} from "react-bootstrap"

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
const Compare = () => {
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    product: [],
  })

  const [productshow, setProductshow] = useState("")
  const [productshow2, setProductshow2] = useState("")
  const [showme,setShowme] = useState("")
  const handlewhichisbest=()=>{
    if(productshow.rating > productshow2.rating && productshow.price > productshow2.price){
      setShowme("Left product is best")

    }else{
      setShowme("right product is best")
    }
  }

  useEffect(async () => {
    dispatch({ type: "FETCH_REQUEST" })
    try {
      let products = await axios.get("/products")
      dispatch({ type: "FETCH_SUCCESS", payload: products.data })
    } catch (err) {
      dispatch({ type: "FETCH_FAILS", payload: err.message })
    }
  }, [])
  let handleCompare = async (params) => {
    let products = await axios.get(`/products/${params.slug}`)
    setProductshow(products.data)
  }
  let handleCompare2 = async (params) => {
    let products2 = await axios.get(`/products/${params.slug}`)
    setProductshow2(products2.data)
  }
  return (
    <>
      <Container>
        <Row>
          <Col>
          {showme?
          <h1 style={{textAlign:"center"}}>{showme}</h1>
          :
          ""
          }
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <DropdownButton
              variant="outline-secondary"
              title="Dropdown"
              id="input-group-dropdown-1"
            >
              {product.map((item) => (
                <Dropdown.Item onClick={() => handleCompare(item)} href="#">
                  <img className="cimg" src={item.img} />
                  {item.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <Card style={{ width: "100%" }}>
            {productshow ? 
              <>
                  <Card.Img src={productshow.img} />
                  <Card.Body>
                    <Card.Title>{productshow.name}</Card.Title>
                    
                    <Card.Text>
                      {productshow.description}
                      {productshow.price}
                    </Card.Text>
                  </Card.Body>
              </>
             : 
             <>
             
               
               <h1>Choose a Product</h1>
               
             
             
             </>
            }
                </Card>
          </Col>
          <Col lg={6}>
            <DropdownButton
              variant="outline-secondary"
              title="Dropdown"
              id="input-group-dropdown-1"
            >
              {product.map((item) => (
                <Dropdown.Item onClick={() => handleCompare2(item)} href="#">
                  <img className="cimg" src={item.img} />
                  {item.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <Card style={{ width: "100%" }}>
            {productshow2 ? (
              <>
                  <Card.Img src={productshow2.img} />
                  <Card.Body>
                    <Card.Title>{productshow2.name}</Card.Title>
                   
                    <Card.Text>
                      {productshow2.description}
                      {productshow2.price}
                    </Card.Text>
                  </Card.Body>
              </>
            ) : (
              <h1>Choose a product</h1>
              )}
              </Card>
          </Col>
        </Row>
        <Row>
          
          
           <Button onClick={handlewhichisbest}>
             See result
           </Button>
           
              
          
        </Row>
      </Container>
    </>
  )
}

export default Compare
