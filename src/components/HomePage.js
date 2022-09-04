import React,{useEffect,useState} from "react"
import { Helmet } from "react-helmet-async"
import {Button,Modal,Container,ListGroup,Row,Col,Card} from 'react-bootstrap'
import axios from 'axios'
const HomePage = () => {
  const [show, setShow] = useState(false);
  const [discountimg,setDiscountimg] = useState("")
  const [category,setCategory] = useState([])
  const catarr = []
  useEffect(async()=>{
    const {data} = await axios.get('/discount')
    setDiscountimg(data.img)
    console.log(data.img)
    setShow(true)

    const product = await axios.get("/products")
    product.data.map(item=>{
      if(catarr.indexOf(item.category)==-1){
        catarr.push(item.category)
      }
    })
    setCategory(catarr)
  },[])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [categoryshow,setCategoryshow] = useState([])

  const handleCategory = async(catproduct)=>{
    const categoryproduct = await axios.get(`/category/${catproduct}`)
    // categoryshow.push(categoryproduct)
    setCategoryshow(categoryproduct.data)
  }
  return (
    <>
      <Helmet>
        <title>Dvaly</title>
      </Helmet>
      
      <div className="banner">
        <img className="w-100" src="/images/banner.jpg" alt="" />
      </div>

      <Container>
        <Row>
          <Col lg={4}>
          <div className="categorylist">
            <ListGroup>
              {category.map(item=>(
                <ListGroup.Item onClick={()=>handleCategory(item)}>{item}</ListGroup.Item>
              ))}
            </ListGroup>
        </div>
          </Col>
        </Row>
            
      </Container>

      <Container>
        <div className="categorypro">
          <Row>
              {categoryshow?
              categoryshow.map(item=>(
                <Col lg={3}>
                <Card>
              <Card.Img variant="top" src={item.img} />
              <Card.Body>
                <Card.Title>
                  {item.name}
                </Card.Title>
                <Card.Text>
                  {item.description}
                </Card.Text>
              </Card.Body>
            </Card>
            </Col>
            )
              )  
              :
              "nothing"
            }
          </Row>
        </div>
       
      </Container>
      
    
     

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={discountimg} alt="" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    




    </>
  )
}

export default HomePage
