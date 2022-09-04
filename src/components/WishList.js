import React, { useContext } from "react"
import { Helmet } from "react-helmet-async"
import { Container, Table, Col, Row, Alert, Button } from "react-bootstrap"
import { Store } from "../Store"
import { Link, useNavigate } from "react-router-dom"
const WishList = () => {
  const navigate = useNavigate()
  const { state2, dispatch2 } = useContext(Store)
  const {
    wishlist: { wishlistItem },
  } = state2

  const updateCart = (item, quantity) => {
    dispatch2({
      type: "WISHLIST_ADD_ITEM",
      payload: {
        ...item,
      },
    })
  }
  let handleRemoveWItem = (item) => {
    dispatch2({
      type: "WISHLIST_REMOVE_ITEM",
      payload: item,
    })
  }

  let handleCheckOut = () => {
    navigate("/signin?redirect=/shipping")
  }

  return (
    <Container>
      <Helmet>
        <title>Wishlist Page</title>
      </Helmet>
      <h1>Your Wishlist</h1>
      <Row>
        <Col lg={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product image</th>
                <th>Prouduct Name</th>
                <th>Product price</th>
                <th>Remove Item</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItem.length <= 0 ? (
                <tr>
                  <td>
                    <h2>wishlist is empty</h2>
                  </td>
                </tr>
              ) : (
                <>
                  {wishlistItem.map((item) => (
                    <>
                      <tr>
                        <td>
                          <img width="70" src={item.img} alt="" />
                        </td>
                        <td>
                          <Link to={`/products/${item.slug}`}>{item.name}</Link>
                        </td>
                        <td>
                          <h3>${item.price}</h3>
                        </td>
                        <td>
                          <Button
                            onClick={() => handleRemoveWItem(item)}
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default WishList
