import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
import CreateGroup from './CreateGroup';
import MyGroups from './MyGroups';

function Home() {
  const navigate = useNavigate()
  const logoutbtn = ()=>{
    axios.get('http://localhost:5000/logout',{
      withCredentials:true
    })
    .then(()=>{
      console.log("user logout successfully")
      navigate('/login',{replace:true})
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  
    const [user,setUser]=useState(null)

    useEffect(()=>{
      axios.get('http://localhost:5000/get-user',{
        withCredentials:true 
      })
      .then((res)=>{
        setUser(res.data.user);
        console.log("current user data",res.data)
      })
      .catch(err =>{
        console.log("Error fetching user:",err)
      })
    },[])

  return(
  <ProtectedRoute>
    {/* <Navbar/> */}
    <CreateGroup/>
    <h1>Welcome to Home Page</h1>
    {user && (
      <div>
        <p>name: {user.name}</p>
        <p>email: {user.email}</p>
      </div>
    )}
    <button onClick={logoutbtn}>LogOut</button>
    <MyGroups/>
  </ProtectedRoute>
  )
}

export default Home;
