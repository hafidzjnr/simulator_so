import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/styles/Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        SynSched
      </Link>

      {/* Hamburger Button */}
      <div
        className={`hamburger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Links */}
      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/instruction" className="nav-link" onClick={() => setOpen(false)}>Instruction</Link>
        <Link to="/simulator" className="nav-link" onClick={() => setOpen(false)}>Simulator</Link>
        <Link to="/about" className="nav-link" onClick={() => setOpen(false)}>About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
