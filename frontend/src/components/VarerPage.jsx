import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Modal, 
  Form, 
  Alert,
  InputGroup,
  Badge,
  ListGroup,
  Spinner
} from 'react-bootstrap';
import { vareService, kategoriService, indkoebslisteService } from '../services';

function VarerPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingVare, setEditingVare] = useState(null);
  const [formData, setFormData] = useState({ navn: '', kategori_id: '', note_vareregister: '' });
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategorier, setSelectedKategorier] = useState([]);

  const queryClient = useQueryClient();

  // Fetch varer
  const { data: varer = [], isLoading: varerLoading } = useQuery(
    ['varer', searchQuery, selectedKategorier],
    () => vareService.search(searchQuery, selectedKategorier),
    {
      onError: (err) => {
        setError(err.response?.data?.error || 'Kunne ikke hente varer');
      }
    }
  );

  // Fetch kategorier
  const { data: kategorier = [] } = useQuery('kategorier', kategoriService.getAll);

  // Create vare mutation
  const createMutation = useMutation(vareService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('varer');
      handleCloseModal();
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke oprette vare');
    }
  });

  // Update vare mutation  
  const updateMutation = useMutation(
    ({ id, data }) => vareService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('varer');
        handleCloseModal();
        setError('');
      },
      onError: (err) => {
        setError(err.response?.data?.error || 'Kunne ikke opdatere vare');
      }
    }
  );

  // Delete vare mutation
  const deleteMutation = useMutation(vareService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('varer');
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke slette vare');
    }
  });

  // Add to shopping list mutation
  const addToListMutation = useMutation(indkoebslisteService.tilfoejVare, {
    onSuccess: () => {
      queryClient.invalidateQueries(['varer', searchQuery, selectedKategorier]);
      queryClient.invalidateQueries('indkoebsliste');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke tilføje til indkøbsliste');
    }
  });

  const handleShowModal = (vare = null) => {
    setEditingVare(vare);
    setFormData({
      navn: vare?.navn || '',
      kategori_id: vare?.kategori_id || '',
      note_vareregister: vare?.note_vareregister || ''
    });
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVare(null);
    setFormData({ navn: '', kategori_id: '', note_vareregister: '' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.navn.trim() || !formData.kategori_id) {
      setError('Varenavn og kategori er påkrævet');
      return;
    }

    if (editingVare) {
      updateMutation.mutate({
        id: editingVare.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (vare) => {
    if (window.confirm(`Er du sikker på, at du vil slette varen "${vare.navn}"?`)) {
      deleteMutation.mutate(vare.id);
    }
  };

  const handleAddToList = (vare) => {
    addToListMutation.mutate(vare.id);
  };

  const handleKategoriToggle = (kategoriId) => {
    setSelectedKategorier(prev => 
      prev.includes(kategoriId) 
        ? prev.filter(id => id !== kategoriId)
        : [...prev, kategoriId]
    );
  };

  const getKategoriNavn = (kategoriId) => {
    const kategori = kategorier.find(k => k.id === kategoriId);
    return kategori?.navn || 'Ukendt';
  };

  if (varerLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Henter varer...</p>
      </div>
    );
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>Vareregister</h1>
          <p className="text-muted">Administrer dine varer og tilføj til indkøbsliste</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleShowModal()} size="lg">
            + Ny Vare
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Card className="mb-4 search-container">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Søg efter varer</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Søg efter varenavn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filtrer på kategorier</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {kategorier.map(kategori => (
                    <Badge
                      key={kategori.id}
                      bg={selectedKategorier.includes(kategori.id) ? 'primary' : 'secondary'}
                      role="button"
                      onClick={() => handleKategoriToggle(kategori.id)}
                      className="p-2"
                    >
                      {kategori.navn}
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
          {selectedKategorier.length > 0 && (
            <Row className="mt-2">
              <Col>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setSelectedKategorier([])}
                >
                  Ryd filtre
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Varer List */}
      <Card>
        <Card.Body>
          {varer.length === 0 ? (
            <div className="text-center py-5">
              <h5>
                {searchQuery || selectedKategorier.length > 0 
                  ? 'Ingen varer matchede din søgning' 
                  : 'Ingen varer endnu'
                }
              </h5>
              <p className="text-muted">
                {searchQuery || selectedKategorier.length > 0
                  ? 'Prøv at ændre dine søgekriterier'
                  : 'Opret din første vare for at komme i gang'
                }
              </p>
              {!searchQuery && selectedKategorier.length === 0 && (
                <Button variant="primary" onClick={() => handleShowModal()}>
                  Opret Vare
                </Button>
              )}
            </div>
          ) : (
            <ListGroup variant="flush">
              {varer.map((vare) => (
                <ListGroup.Item 
                  key={vare.id} 
                  className="d-flex justify-content-between align-items-start shopping-item fade-in"
                >
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{vare.navn}</h6>
                    <p className="mb-1 text-muted small">
                      <Badge bg="info" className="me-2 category-badge">
                        {vare.kategori_navn}
                      </Badge>
                      {vare.note_vareregister && (
                        <span>{vare.note_vareregister}</span>
                      )}
                    </p>
                    <small className="text-muted">
                      Oprettet: {new Date(vare.oprettelsesdato).toLocaleDateString('da-DK')}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    {vare.paa_liste ? (
                      <Badge bg="success" className="align-self-start">
                        På liste
                      </Badge>
                    ) : (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleAddToList(vare)}
                        disabled={addToListMutation.isLoading}
                      >
                        + Liste
                      </Button>
                    )}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowModal(vare)}
                    >
                      Rediger
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(vare)}
                    >
                      Slet
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Vare Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingVare ? 'Rediger Vare' : 'Ny Vare'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Varenavn *</Form.Label>
              <Form.Control
                type="text"
                placeholder="F.eks. Mælk"
                value={formData.navn}
                onChange={(e) => setFormData({...formData, navn: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Kategori *</Form.Label>
              <Form.Select
                value={formData.kategori_id}
                onChange={(e) => setFormData({...formData, kategori_id: parseInt(e.target.value)})}
                required
              >
                <option value="">Vælg kategori</option>
                {kategorier.map(kategori => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.navn}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Valgfri note om varen"
                value={formData.note_vareregister}
                onChange={(e) => setFormData({...formData, note_vareregister: e.target.value})}
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
            {editingVare ? 'Opdater' : 'Opret'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VarerPage;