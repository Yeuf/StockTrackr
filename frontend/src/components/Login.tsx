import React from "react"
import axios from 'axios'
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom'
import Button from "./Button";

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
                        alert("Error Occurred. Try Again")
                    }
                }
            })
    }

    return (
        <div className="flex min-h-screen justify-center items-center bg-white">
            <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
                <div>
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="username"
                                autoComplete="username"
                                required
                                onChange={(e)=>setFormData({...formData, username: e.target.value})}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                        </div>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                onChange={(e)=>setFormData({...formData, password: e.target.value})}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <Button
                            type="submit"
                            color="indigo"
                            className="px-4 py-2"
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
                {/* <p className="text-center text-sm text-gray-600">
                    Not a member? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Start a 14-day free trial</a>
                </p> */}
            </div>
        </div>
    )
}

export default Login
