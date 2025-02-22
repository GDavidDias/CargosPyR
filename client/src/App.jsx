//import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from "react-redux";
//import Home from './views/Home/Home.jsx'
import Landing from './views/Landing/Landing'
//import { useEffect} from 'react'
import Home from './views/Home/Home';
import { useEffect } from 'react';
import { fetchConfig } from './utils/fetchConfig';

function App() {
  const userSG = useSelector((state)=>state.user);

  useEffect(()=>{
    //console.log('que tiene userSG en APP: ', userSG);
  },[userSG])


  return (
    <div className='m-0 '>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        {/* {userSG.username==='' ?(
          <Route path='/' element={<Landing/>}/>
        ) :(
          <Route path='/home' element={<Home/>}/>
        )
        } */}
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App