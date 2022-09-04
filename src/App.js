import { useContext, useState } from "react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Navbar,
  Container,
  Nav,
  Row,
  Col,
  Card,
  Button,
  Badge,
  DropdownButton,
  NavDropdown,
  Dropdown,
  Table,
  Offcanvas,
} from "react-bootstrap"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import HomePage from "./components/HomePage"
import ProductPage from "./components/ProductPage"
import ProductsSlug from "./components/ProductsSlug"
import { Store } from "./Store"
import Cart from "./components/Cart"
import Login from "./Login"
import WishList from "./components/WishList"
import Compare from "./components/Compare"
import { Shipping } from './components/Shipping';
import Signup from './components/Signup';
import Payment from "./components/Payment";
import Placeorder from './components/Placeorder';
import Order from './components/Order';
function App() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { state, dispatch, state2, dispatch2,state3,dispatch3 } = useContext(Store)

  const { cart: { cartItem } } = state
  const { wishlist: { wishlistItem } } = state2
  const {userInfo} = state3



  const updateCart = (item, quantity) => {
    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...item,
        quantity,
      },
    })
  }
  let handleRemoveItem = (item) => {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    })
  }
  let handleRemoveWItem = (item) => {
    dispatch2({
      type: "WISHLIST_REMOVE_ITEM",
      payload: item,
    })
  }
  let handleLogout = ()=>{
    dispatch3({type:"USER_LOGOUT"})
    localStorage.removeItem("userInfo")
  }

  return (
    <>
      <BrowserRouter>
        <Navbar bg="dark" variant="dark">
          <Container>
          <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              limit={1}
              theme="dark"
              />
            <Navbar.Brand href="#home">Dvaly</Navbar.Brand>
            <Nav className="ms-auto menu">
              <Link to="/">Home</Link>
              <Link to="/products">Real product</Link>

              <DropdownButton title="Cart">
                <Table>
                  {cartItem.map((item) => (
                    <>
                      <tr>
                        <td>
                          <img width="70" src={item.img} alt="" />
                        </td>
                        <td>
                          <Link
                            style={{ color: "#000" }}
                            to={`/products/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td
                          style={{
                            color: "#000",
                            display: "inline",
                            paddingTop: "63px",
                            marginRight: "20px",
                          }}
                        >
                          <Button
                            style={{
                              color: "#000",
                              background: "#6C757D",
                              border: "none",
                              boxShadow: "none",
                            }}
                            onClick={() => {
                              updateCart(item, item.quantity - 1)
                            }}
                            disabled={item.quantity == 1}
                          >
                            -
                          </Button>
                          {item.quantity}
                          <Button
                            style={{
                              color: "#000",
                              background: "#6C757D",
                              border: "none",
                              boxShadow: "none",
                            }}
                            onClick={() => {
                              updateCart(item, item.quantity + 1)
                            }}
                            disabled={item.quantity == item.instock}
                          >
                            +
                          </Button>
                        </td>
                        <td>
                          <Button
                            style={{ color: "#000" }}
                            onClick={() => handleRemoveItem(item)}
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </Table>
                <Dropdown.Divider />
                <Button className="w-100 px-4">
                  <Link style={{ color: "#000", display: "block" }} to="/cart">
                    Cart Page
                  </Link>
                </Button>
              </DropdownButton>
              {state.cart.cartItem.length > 0 ? (
                <Badge pill bg="danger">
                  {state.cart.cartItem.length}
                </Badge>
              ) : (
                ""
              )}

              {/* ====================== Wishlist ================== */}

              <DropdownButton title="Wishlist">
                <Table>
                  {wishlistItem.map((item) => (
                    <>
                      <tr>
                        <td>
                          <img width="70" src={item.img} alt="" />
                        </td>
                        <td>
                          <Link
                            style={{ color: "#000" }}
                            to={`/products/${item.slug}`}
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td>
                          <Button
                            style={{ color: "#000" }}
                            onClick={() => handleRemoveWItem(item)}
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
                </Table>
                <Dropdown.Divider />
                <Button className="w-100 px-4">
                  <Link
                    style={{ color: "#000", display: "block" }}
                    to="/wishlist"
                  >
                    Go to Wishlist
                  </Link>
                </Button>
              </DropdownButton>
              {state2.wishlist.wishlistItem.length > 0 ? (
                <Badge pill bg="danger">
                  {state2.wishlist.wishlistItem.length}
                </Badge>
              ) : (
                ""
              )}

              {userInfo?
               <DropdownButton title={userInfo.name} id="basic-nav-dropdown">
                <Dropdown.Item style={{color:"#000"}} onClick={handleLogout}>Logout</Dropdown.Item>
             </DropdownButton>
              :
              
                
                <Link to="/signin">Signin</Link>

                

              
              }
            </Nav>

          </Container>
        </Navbar>
        <Button
          variant="primary"
          onClick={handleShow}
          className="me-2 sidebarbutton"
        >
          cart
        </Button>
        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {cartItem.map((item) => (
              <>
                <tr>
                  <td>
                    <img width="70" src={item.img} alt="" />
                  </td>
                  <td>
                    <Link
                      style={{ color: "#000" }}
                      to={`/products/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td
                    style={{
                      color: "#000",
                      display: "inline",
                      paddingTop: "63px",
                      marginRight: "20px",
                    }}
                  >
                    <Button
                      style={{
                        color: "#000",
                        background: "#6C757D",
                        border: "none",
                        boxShadow: "none",
                      }}
                      onClick={() => {
                        updateCart(item, item.quantity - 1)
                      }}
                      disabled={item.quantity == 1}
                    >
                      -
                    </Button>
                    {item.quantity}
                    <Button
                      style={{
                        color: "#000",
                        background: "#6C757D",
                        border: "none",
                        boxShadow: "none",
                      }}
                      onClick={() => {
                        updateCart(item, item.quantity + 1)
                      }}
                      disabled={item.quantity == item.instock}
                    >
                      +
                    </Button>
                  </td>
                  <td>
                    <Button
                      style={{ color: "#000" }}
                      onClick={() => handleRemoveItem(item)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
                <Dropdown.Divider />
              </>
            ))}
          </Offcanvas.Body>
        </Offcanvas>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:slug" element={<ProductsSlug />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<Placeorder />} />
          <Route path="/orders/:id" element={<Order />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
