import React from "react"
import axios from 'axios'
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const signIn = useSignIn()
    const [formData, setFormData] = React.useState({username: '', password: ''})
    const navigate = useNavigate()

    const onSubmit = (e: any) => {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/login', formData)
            .then((res)=>{
                if(res.status === 200){
                    if(signIn({
                        auth: {
                            token: res.data.access_token,
                            type: 'Bearer'
                        },
                        // refresh: res.data.refresh_token,
                        userState: res.data.authUserState
                    })){ 
                        navigate('/home')
                    }else {
                        alert("Error Occoured. Try Again")
                    }
                }
            })
    }

    return (
        <form onSubmit={onSubmit}>
            <input type={"username"} onChange={(e)=>setFormData({...formData, username: e.target.value})}/>
            <input type={"password"} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>

            <button>Submit</button>
        </form>
    )
}

export default Login