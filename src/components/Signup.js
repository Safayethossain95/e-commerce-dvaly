import React,{ useState,useContext, useEffect  } from 'react'
import { Form,Container,Button,Alert } from 'react-bootstrap'
import { Link,Navigate,useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios'
import {Store} from '../Store'
import { useNavigate } from 'react-router-dom';
const Signup = () => {

    const navigate = useNavigate()
    let {search} = useLocation()
    let redirectUrl = new URLSearchParams(search).get('redirect')
    let redirect = redirectUrl ? redirectUrl : '/'

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [cpassword,setCpassword] = useState("")


    const {state3,dispatch3} = useContext(Store)
    const {userInfo} = state3

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const {data} = await axios.post('/api/users/signup',{
                name,
                email,
                password
            })
            console.log(data)
           
            navigate('/signin',{state:"Sign up successful! Please Login"})
        }catch(err){
            toast.error(err.message)

        }

    }
    useEffect(()=>{
        
            if(userInfo){
                navigate(redirect)
            }
        
    },[])
  return (
    <Container className='w-25 border p-3 mt-3'>
        
        <Alert variant="primary">
            Registration Page
        </Alert>
        <Form onSubmit={handleSubmit}>
        <Form.Label >Name</Form.Label>
            <Form.Control
                type="text"
                onChange={(e)=>setName(e.target.value)}
            />
            <Form.Label >Email</Form.Label>
            <Form.Control
                type="email"
                onChange={(e)=>setEmail(e.target.value)}
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                onChange={(e)=>setPassword(e.target.value)}
            />
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
                type="password"
                onChange={(e)=>setCpassword(e.target.value)}
            />
            <Button type="submit" className="w-100 mt-3" variant="primary">Sign Up</Button>

        </Form>
        <br></br>
        <Form.Text className=''>
            Already have an Account? <Link to={`/signup?redirect=${redirect}`}>Create Account</Link>
        </Form.Text>
    </Container>
  )
}

export default Signup