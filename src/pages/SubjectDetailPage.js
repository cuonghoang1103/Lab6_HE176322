import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Navbar, Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const toForm = (subject) => ({
  ...subject,
  preRequisites: subject.preRequisites.join(', '),
});

function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/subjects/${id}`)
      .then((res) => setForm(toForm(res.data)))
      .catch(() => setError('Không tìm thấy môn học'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.code.trim()) newErrors.code = 'Code không được để trống';
    if (!form.name.trim()) newErrors.name = 'Name không được để trống';
    const semester = Number(form.semester);
    const credits = Number(form.credits);
    if (!Number.isInteger(semester) || semester <= 0) {
      newErrors.semester = 'Semester phải là số nguyên lớn hơn 0';
    }
    if (!Number.isInteger(credits) || credits <= 0) {
      newErrors.credits = 'Credits phải là số nguyên lớn hơn 0';
    }
    return newErrors;
  };

  const handleEditSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setMessage('');
      return;
    }

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updatedSubject = {
      ...form,
      semester: Number(form.semester),
      credits: Number(form.credits),
      preRequisites: form.preRequisites
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== ''),
    };

    try {
      const res = await api.put(`/subjects/${id}`, updatedSubject);
      setForm(toForm(res.data));
      setIsEditing(false);
      setError('');
      setMessage('Cập nhật môn học thành công');
    } catch (err) {
      setError('Cập nhật thất bại');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa môn ${form.code}?`)) return;

    try {
      await api.delete(`/subjects/${id}`);
      navigate('/syllabus');
    } catch (err) {
      setError('Xóa thất bại');
    }
  };

  const readOnlyClass = isEditing ? '' : 'bg-body-secondary';

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand>Subject Detail Management</Navbar.Brand>
          <Button as={Link} to="/syllabus" variant="outline-light" size="sm">
            Back to List
          </Button>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            {!loading && form && (
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title as="h4" className="mb-3">
                    Subject Information
                  </Card.Title>

                  <Form>
                    <Form.Group className="mb-3" controlId="code">
                      <Form.Label className="fw-bold">Code</Form.Label>
                      <Form.Control
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                        isInvalid={!!errors.code}
                      />
                      <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label className="fw-bold">Name</Form.Label>
                      <Form.Control
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="curriculum">
                      <Form.Label className="fw-bold">Curriculum</Form.Label>
                      <Form.Control
                        name="curriculum"
                        value={form.curriculum}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="semester">
                      <Form.Label className="fw-bold">Semester</Form.Label>
                      <Form.Control
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                        isInvalid={!!errors.semester}
                      />
                      <Form.Control.Feedback type="invalid">{errors.semester}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="credits">
                      <Form.Label className="fw-bold">Credits</Form.Label>
                      <Form.Control
                        name="credits"
                        value={form.credits}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                        isInvalid={!!errors.credits}
                      />
                      <Form.Control.Feedback type="invalid">{errors.credits}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="preRequisites">
                      <Form.Label className="fw-bold">Pre-requisites (cách nhau bởi dấu phẩy)</Form.Label>
                      <Form.Control
                        name="preRequisites"
                        value={form.preRequisites}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="description">
                      <Form.Label className="fw-bold">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={readOnlyClass}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button variant={isEditing ? 'success' : 'primary'} onClick={handleEditSave}>
                        {isEditing ? 'Save' : 'Edit'}
                      </Button>
                      <Button variant="danger" onClick={handleDelete}>
                        Delete
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SubjectDetailPage;
