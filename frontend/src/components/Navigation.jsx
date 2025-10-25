import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🛒 Huskeseddel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Indkøbsliste
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/varer" 
              active={location.pathname === '/varer'}
            >
              Varer
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/kategorier" 
              active={location.pathname === '/kategorier'}
            >
              Kategorier
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;