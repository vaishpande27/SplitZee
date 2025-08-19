import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CreateGroup from './CreateGroup';
import MyGroups from './MyGroups';

function Home() {


  return(
  <ProtectedRoute>
    <Navbar/>
    <CreateGroup/>
    <h1>Welcome to Home Page</h1>
    <MyGroups/>
    
  </ProtectedRoute>
  )
}

export default Home;
