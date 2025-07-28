import axios from "axios";
import React, {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({children}){
    const [loading,setLoading]=useState(true)
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:5000/verify-user',{
            withCredentials:true
        })
        .then((res)=>{
            console.log(res.data.message);
            setLoading(false)
        })
        .catch(()=>{
            console.log('Not authenticated');
            navigate('./login')
        })
    },[navigate])

    if(loading) return <p>Loading....</p>

    return children
}

export default ProtectedRoute;