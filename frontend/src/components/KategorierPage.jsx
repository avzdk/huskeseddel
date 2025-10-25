import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Card, 
  Button, 
  Table, 
  Modal, 
  Form, 
  Alert,
  Row,
  Col,
  Spinner,
  Badge
} from 'react-bootstrap';
import { kategoriService } from '../services';

function KategorierPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [formData, setFormData] = useState({ navn: '', beskrivelse: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  // Fetch kategorier
  const { data: kategorier = [], isLoading, error: fetchError } = useQuery(
    'kategorier',
    kategoriService.getAll,
    {
      onError: (err) => {
        setError(err.response?.data?.error || 'Kunne ikke hente kategorier');
      }
    }
  );

  // Create kategori mutation
  const createMutation = useMutation(kategoriService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('kategorier');
      handleCloseModal();
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke oprette kategori');
    }
  });

  // Update kategori mutation
  const updateMutation = useMutation(
    ({ id, data }) => kategoriService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('kategorier');
        handleCloseModal();
        setError('');
      },
      onError: (err) => {
        setError(err.response?.data?.error || 'Kunne ikke opdatere kategori');
      }
    }
  );

  // Delete kategori mutation
  const deleteMutation = useMutation(kategoriService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('kategorier');
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke slette kategori');
    }
  });

  const handleShowModal = (kategori = null) => {
    setEditingKategori(kategori);
    setFormData({
      navn: kategori?.navn || '',
      beskrivelse: kategori?.beskrivelse || ''
    });
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingKategori(null);
    setFormData({ navn: '', beskrivelse: '' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.navn.trim()) {
      setError('Kategorinavn er påkrævet');
      return;
    }

    if (editingKategori) {
      updateMutation.mutate({
        id: editingKategori.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (kategori) => {
    if (window.confirm(`Er du sikker på, at du vil slette kategorien "${kategori.navn}"?`)) {
      deleteMutation.mutate(kategori.id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Henter kategorier...</p>
      </div>
    );
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>Kategorier</h1>
          <p className="text-muted">Administrer kategorier til dine varer</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleShowModal()}
            size="lg"
          >
            + Ny Kategori
          </Button>
        </Col>
      </Row>

      {(error || fetchError) && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error || fetchError?.response?.data?.error || 'Der opstod en fejl'}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {kategorier.length === 0 ? (
            <div className="text-center py-5">
              <h5>Ingen kategorier endnu</h5>
              <p className="text-muted">Opret din første kategori for at komme i gang</p>
              <Button variant="primary" onClick={() => handleShowModal()}>
                Opret Kategori
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Beskrivelse</th>
                  <th>Antal Varer</th>
                  <th>Oprettet</th>
                  <th width="120">Handlinger</th>
                </tr>
              </thead>
              <tbody>
                {kategorier.map((kategori) => (
                  <tr key={kategori.id}>
                    <td>
                      <strong>{kategori.navn}</strong>
                    </td>
                    <td>{kategori.beskrivelse || '-'}</td>
                    <td>
                      <Badge bg="secondary">
                        {kategori.antal_varer} varer
                      </Badge>
                    </td>
                    <td>
                      {new Date(kategori.oprettelsesdato).toLocaleDateString('da-DK')}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleShowModal(kategori)}
                      >
                        Rediger
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(kategori)}
                        disabled={kategori.antal_varer > 0}
                      >
                        Slet
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Kategori Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingKategori ? 'Rediger Kategori' : 'Ny Kategori'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Kategorinavn *</Form.Label>
              <Form.Control
                type="text"
                placeholder="F.eks. Mejeriprodukter"
                value={formData.navn}
                onChange={(e) => setFormData({...formData, navn: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Beskrivelse</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Valgfri beskrivelse af kategorien"
                value={formData.beskrivelse}
                onChange={(e) => setFormData({...formData, beskrivelse: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuller
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {(createMutation.isLoading || updateMutation.isLoading) && (
              <Spinner as="span" animation="border" size="sm" role="status" className="me-1" />
            )}
            {editingKategori ? 'Opdater' : 'Opret'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default KategorierPage;