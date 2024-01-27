import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importing the CSS file for Navbar styling

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/cart">Cart</Link>
    </nav>
  );
}

export default Navbar;
