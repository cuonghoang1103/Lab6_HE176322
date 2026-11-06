import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';

function AppNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/syllabus">
          FPT Education Learning Materials Portal
        </Navbar.Brand>
        <Navbar.Text className="ms-auto me-3 text-white">
          Hello, {user.fullName} ({user.role})
        </Navbar.Text>
        <Button variant="outline-light" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
