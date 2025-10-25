import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Alert,
  ListGroup,
  Badge,
  Form,
  InputGroup,
  Modal,
  Spinner,
  ProgressBar
} from 'react-bootstrap';
import { indkoebslisteService, vareService } from '../services';

function IndkoebslistePage() {
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVare, setSelectedVare] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showHistorik, setShowHistorik] = useState(false);

  const queryClient = useQueryClient();

  // Fetch aktiv indkøbsliste
  const { data: aktivListe = [], isLoading: listeLoading } = useQuery(
    'indkoebsliste',
    indkoebslisteService.getAktivListe,
    {
      onError: (err) => {
        setError(err.response?.data?.error || 'Kunne ikke hente indkøbsliste');
      }
    }
  );

  // Fetch historik
  const { data: historik = [] } = useQuery(
    'indkoebsliste-historik',
    () => indkoebslisteService.getHistorik(20),
    { enabled: showHistorik }
  );

  // Fetch liste statistik
  const { data: stats } = useQuery('indkoebsliste-stats', indkoebslisteService.getStats);

  // Fetch varer for add modal
  const { data: alleVarer = [] } = useQuery(
    ['varer-search', searchQuery],
    () => vareService.search(searchQuery),
    { enabled: showAddModal }
  );

  // Mark as purchased mutation
  const markerKoebtMutation = useMutation(indkoebslisteService.markerSomKoebt, {
    onSuccess: () => {
      queryClient.invalidateQueries('indkoebsliste');
      queryClient.invalidateQueries('indkoebsliste-stats');
      queryClient.invalidateQueries(['varer', '', []]);
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke markere som købt');
    }
  });

  // Reactivate mutation
  const genaktiverMutation = useMutation(indkoebslisteService.genaktiver, {
    onSuccess: () => {
      queryClient.invalidateQueries('indkoebsliste');
      queryClient.invalidateQueries('indkoebsliste-stats');
      queryClient.invalidateQueries(['varer', '', []]);
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke genaktivere');
    }
  });

  // Remove from list mutation
  const fjernMutation = useMutation(indkoebslisteService.fjernFraListe, {
    onSuccess: () => {
      queryClient.invalidateQueries('indkoebsliste');
      queryClient.invalidateQueries('indkoebsliste-stats');
      queryClient.invalidateQueries(['varer', '', []]);
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke fjerne fra liste');
    }
  });

  // Add to list mutation
  const tilfoejMutation = useMutation(indkoebslisteService.tilfoejVare, {
    onSuccess: () => {
      queryClient.invalidateQueries('indkoebsliste');
      queryClient.invalidateQueries('indkoebsliste-stats');
      queryClient.invalidateQueries(['varer', '', []]);
      handleCloseAddModal();
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke tilføje til liste');
    }
  });

  // Clear purchased mutation
  const rydKoebteMutation = useMutation(indkoebslisteService.rydKoebtevarer, {
    onSuccess: () => {
      queryClient.invalidateQueries('indkoebsliste');
      queryClient.invalidateQueries('indkoebsliste-stats');
      queryClient.invalidateQueries('indkoebsliste-historik');
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Kunne ikke rydde købte varer');
    }
  });

  const handleShowAddModal = () => {
    setShowAddModal(true);
    setSearchQuery('');
    setSelectedVare(null);
    setNoteText('');
    setError('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSearchQuery('');
    setSelectedVare(null);
    setNoteText('');
  };

  const handleAddVare = () => {
    if (!selectedVare) {
      setError('Vælg en vare');
      return;
    }
    tilfoejMutation.mutate(selectedVare.id, noteText);
  };

  const handleMarkerKoebt = (element) => {
    markerKoebtMutation.mutate(element.id);
  };

  const handleGenaktiver = (element) => {
    genaktiverMutation.mutate(element.id);
  };

  const handleFjern = (element) => {
    if (window.confirm(`Fjern "${element.vare_navn}" fra listen?`)) {
      fjernMutation.mutate(element.id);
    }
  };

  const handleRydKoebte = () => {
    if (window.confirm('Fjern alle købte varer fra listen?')) {
      rydKoebteMutation.mutate();
    }
  };

  // Filter available varer (not already on active list)
  const tilgaengeligeVarer = alleVarer.filter(vare => !vare.paa_liste);

  if (listeLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Henter indkøbsliste...</p>
      </div>
    );
  }

  const aktiveVarer = aktivListe.filter(item => item.status === 'aktiv');
  const koebteVarer = aktivListe.filter(item => item.status === 'købt');

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>Min Indkøbsliste</h1>
          <p className="text-muted">Hold styr på dine indkøb</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleShowAddModal} size="lg">
            + Tilføj Vare
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Card */}
      {stats && (
        <Card className="mb-4 stats-card">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h5 className="mb-3">Indkøbsstatus</h5>
                <ProgressBar
                  variant="success"
                  now={stats.procent_købt}
                  label={`${stats.procent_købt}%`}
                  className="mb-2"
                />
                <small>
                  {stats.købte_varer} af {stats.total_varer} varer købt
                </small>
              </Col>
              <Col md={4} className="text-md-end">
                <div>
                  <h6>Aktive varer</h6>
                  <h3>{stats.aktive_varer}</h3>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Aktive Varer */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Aktive Varer ({aktiveVarer.length})</h5>
          {aktivListe.length > 0 && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRydKoebte}
              disabled={koebteVarer.length === 0}
            >
              Ryd Købte
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {aktiveVarer.length === 0 ? (
            <div className="text-center py-4">
              <h6>Ingen aktive varer på listen</h6>
              <p className="text-muted">Tilføj nogle varer for at komme i gang</p>
              <Button variant="primary" onClick={handleShowAddModal}>
                Tilføj Vare
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {aktiveVarer.map((item) => (
                <ListGroup.Item 
                  key={item.id} 
                  className="d-flex justify-content-between align-items-start shopping-item fade-in"
                >
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.vare_navn}</h6>
                    {item.kategori_navn && (
                      <Badge bg="info" className="me-2 category-badge">
                        {item.kategori_navn}
                      </Badge>
                    )}
                    {item.note_liste && (
                      <p className="mb-1 text-muted small">{item.note_liste}</p>
                    )}
                    <small className="text-muted">
                      Tilføjet: {new Date(item.tilfoejelsesdato).toLocaleDateString('da-DK')}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkerKoebt(item)}
                      disabled={markerKoebtMutation.isLoading}
                    >
                      ✓ Købt
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleFjern(item)}
                    >
                      Fjern
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Købte Varer */}
      {koebteVarer.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Købte Varer ({koebteVarer.length})</h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {koebteVarer.map((item) => (
                <ListGroup.Item 
                  key={item.id} 
                  className="d-flex justify-content-between align-items-start shopping-item completed fade-in"
                >
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.vare_navn}</h6>
                    {item.kategori_navn && (
                      <Badge bg="secondary" className="me-2 category-badge">
                        {item.kategori_navn}
                      </Badge>
                    )}
                    {item.note_liste && (
                      <p className="mb-1 text-muted small">{item.note_liste}</p>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleGenaktiver(item)}
                      disabled={genaktiverMutation.isLoading}
                    >
                      ↶ Genaktiver
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleFjern(item)}
                    >
                      Fjern
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {/* Tilføj Vare Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tilføj Vare til Indkøbsliste</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          
          <Form.Group className="mb-3">
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

          <Form.Group className="mb-3">
            <Form.Label>Vælg vare</Form.Label>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {tilgaengeligeVarer.length === 0 ? (
                <p className="text-muted">Ingen tilgængelige varer fundet</p>
              ) : (
                <ListGroup>
                  {tilgaengeligeVarer.map((vare) => (
                    <ListGroup.Item
                      key={vare.id}
                      action
                      active={selectedVare?.id === vare.id}
                      onClick={() => setSelectedVare(vare)}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-1">{vare.navn}</h6>
                          <Badge bg="info" className="category-badge">
                            {vare.kategori_navn}
                          </Badge>
                          {vare.note_vareregister && (
                            <p className="mb-0 text-muted small mt-1">
                              {vare.note_vareregister}
                            </p>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Note (valgfri)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Tilføj en note til denne vare på listen..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Annuller
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddVare}
            disabled={!selectedVare || tilfoejMutation.isLoading}
          >
            {tilfoejMutation.isLoading && (
              <Spinner as="span" animation="border" size="sm" role="status" className="me-1" />
            )}
            Tilføj til Liste
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default IndkoebslistePage;