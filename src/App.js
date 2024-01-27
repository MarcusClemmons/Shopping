import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar'; // Import the Navbar component
import PastOrders from './PastOrders';

import Homepage from './Homepage';
import Login from './Login';
import Cart from './Cart';
import Shop from './Shop';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar /> {/* Include the Navbar component */}
        <Routes>
          <Route path='/' element={<Homepage title="Cologne R US" message="Welcome to Cologne R US the finest high-end cologne shop online."/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/past-orders" element={<PastOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
