import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import AppNavbar from '../components/AppNavbar';
import api from '../services/api';

function SyllabusPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchBy, setSearchBy] = useState('code');
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState({ by: 'code', keyword: '' });

  useEffect(() => {
    api
      .get('/subjects')
      .then((res) => setSubjects(res.data))
      .catch(() => setError('Không tải được danh sách môn học'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter({ by: searchBy, keyword: keyword.trim() });
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject[filter.by].toLowerCase().includes(filter.keyword.toLowerCase())
  );

  return (
    <>
      <AppNavbar />

      <Container className="py-4">
        <h3 className="mb-4">Syllabus Management</h3>

        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="align-items-center g-2">
            <Col xs="auto">
              <Form.Label htmlFor="searchBy" className="fw-bold mb-0">
                Search by:
              </Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Select
                id="searchBy"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
              >
                <option value="code">Code</option>
                <option value="name">Name</option>
              </Form.Select>
            </Col>
            <Col md={5}>
              <Form.Control
                placeholder="Enter keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" variant="primary">
                Search
              </Button>
            </Col>
          </Row>
        </Form>

        <h5 className="mb-3">Subject List</h5>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Table bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Curriculum</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Pre-requisites</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td>
                    <Link to={`/subject/${subject.id}`}>{subject.code}</Link>
                  </td>
                  <td>{subject.name}</td>
                  <td>{subject.curriculum}</td>
                  <td>{subject.semester}</td>
                  <td>{subject.credits}</td>
                  <td>
                    {subject.preRequisites.length > 0
                      ? subject.preRequisites.join(', ')
                      : 'None'}
                  </td>
                  <td>{subject.description}</td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    Không tìm thấy môn học
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}

export default SyllabusPage;
