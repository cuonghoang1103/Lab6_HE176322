import { useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ROLES = ['Student', 'Lecturer'];

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await api.get('/accounts');
      const account = res.data.find(
        (acc) => acc.email === email.trim() && acc.password === password
      );

      if (!account) {
        setMessage('Email hoặc mật khẩu không đúng');
      } else if (account.status === 'Inactive') {
        setMessage('Tài khoản đã bị khóa');
      } else if (!ROLES.includes(account.role)) {
        setMessage('Bạn không có quyền truy cập');
      } else {
        const user = {
          id: account.id,
          email: account.email,
          fullName: account.fullName,
          role: account.role,
        };
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/syllabus');
        return;
      }
    } catch (err) {
      setMessage('Không kết nối được server (json-server cổng 9000)');
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="w-100 shadow" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <Card.Title as="h3" className="text-center mb-4">
            Sign In
          </Card.Title>

          {message && <Alert variant="danger">{message}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="email of student or lecture"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
