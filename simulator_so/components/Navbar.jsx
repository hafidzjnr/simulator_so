import React from 'react';
import { Link } from 'react-router-dom';
import '../src/styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        SynSched
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/instruction" className="nav-link">Instruction</Link>
        <Link to="/simulator" className="nav-link">Simulator</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;