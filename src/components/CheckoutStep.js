import React from 'react'
import {Container,Row,Col} from 'react-bootstrap'

const CheckoutStep = (props) => {
  return (
    <>
        <Container className="step">
            <Row>
                <Col lg={3}>
                    <h2 className={props.step1? "stepactive" : ''}>Sign In</h2>
                </Col>
                <Col lg={3}>
                    <h2 className={props.step2? "stepactive" : ''}>Shipping Info</h2>
                </Col>
                <Col lg={3}>
                    <h2 className={props.step3? "stepactive" : ''}>Payment</h2>
                </Col>
                <Col lg={3}>
                    <h2 className={props.step4? "stepactive" : ''}>Place Order</h2>
                </Col>
            </Row>
        </Container>
    </>
  )
}

export default CheckoutStep