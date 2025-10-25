import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCollections } from '../hooks';
import { Button, Input, Modal, Badge } from '../components';
import type { Collection, TestSuite } from '../store/store.exports';

const DetailWrapper = styled.div`
  padding: 24px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 12px;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const SuitesSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuitesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SuiteCard = styled.div`
  background: ${({ theme }) => theme['primary-theme']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme['brand']};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SuiteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const SuiteName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 4px;
`;

const SuitePath = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
  font-family: 'Monaco', 'Courier New', monospace;
`;

const SuiteActions = styled.div`
  display: flex;
  gap: 8px;
`;

const SuiteStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const StatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: ${({ theme }) => theme['sidebar-background']};
  border: 1px dashed ${({ theme }) => theme['layout-border']};
  border-radius: 8px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 16px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme['layout-border']};
`;

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, updateCollection, deleteCollection } = useCollections();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddSuiteModalOpen, setIsAddSuiteModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newSuitePath, setNewSuitePath] = useState('');

  // Encontrar collection
  useEffect(() => {
    const found = collections.find((c) => c.id === id);
    if (found) {
      setCollection(found);
      setEditedName(found.name);
      setEditedDescription(found.description || '');
    } else if (collections.length > 0) {
      // Collection não encontrada, voltar para lista
      navigate('/collections');
    }
  }, [id, collections, navigate]);

  const handleEdit = () => {
    if (!editedName.trim() || !collection) return;

    updateCollection(collection.id, {
      name: editedName.trim(),
      description: editedDescription.trim(),
    });

    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (!collection) return;
    deleteCollection(collection.id);
    navigate('/collections');
  };

  const handleAddSuite = () => {
    if (!newSuitePath.trim() || !collection) return;

    // TODO: Implementar adição de suite
    // Por enquanto, apenas fecha o modal
    setNewSuitePath('');
    setIsAddSuiteModalOpen(false);
  };

  const handleRemoveSuite = (suiteId: string) => {
    // TODO: Implementar remoção de suite
    console.log('Remove suite:', suiteId);
  };

  if (!collection) {
    return (
      <DetailWrapper>
        <EmptyState>
          <EmptyIcon>📦</EmptyIcon>
          <EmptyText>Loading collection...</EmptyText>
        </EmptyState>
      </DetailWrapper>
    );
  }

  return (
    <DetailWrapper>
      <Header>
        <HeaderLeft>
          <Title>
            <Button variant="ghost" size="sm" onClick={() => navigate('/collections')}>
              ←
            </Button>
            {collection.name}
            <Badge variant="default" size="sm">
              {collection.suites?.length || 0} suites
            </Badge>
          </Title>

          {collection.description && <Description>{collection.description}</Description>}

          <MetaInfo>
            <MetaItem>📅 Created {new Date(collection.createdAt).toLocaleDateString()}</MetaItem>
            <MetaItem>🔄 Updated {new Date(collection.updatedAt).toLocaleDateString()}</MetaItem>
          </MetaInfo>
        </HeaderLeft>

        <HeaderActions>
          <Button variant="primary" size="md" onClick={() => navigate(`/collections/${collection.id}/run`)}>
            ▶️ Run All
          </Button>
          <Button variant="outline" size="md" onClick={() => setIsEditModalOpen(true)}>
            ✏️ Edit
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setIsDeleteModalOpen(true)}
            style={{ color: 'var(--text-danger)' }}
          >
            🗑️ Delete
          </Button>
        </HeaderActions>
      </Header>

      <SuitesSection>
        <SectionTitle>
          📄 Test Suites
          <Button variant="primary" size="sm" onClick={() => navigate(`/collections/${collection.id}/suites/new`)}>
            + Add Suite
          </Button>
        </SectionTitle>

        {!collection.suites || collection.suites.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📄</EmptyIcon>
            <EmptyText>
              No test suites in this collection yet.
              <br />
              Click &quot;Add Suite&quot; to get started.
            </EmptyText>
          </EmptyState>
        ) : (
          <SuitesList>
            {collection.suites.map((suite: TestSuite) => (
              <SuiteCard key={suite.id}>
                <SuiteHeader>
                  <div>
                    <SuiteName>{suite.suite_name}</SuiteName>
                    <SuitePath>{suite.node_id}</SuitePath>
                  </div>
                  <SuiteActions>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/collections/${collection.id}/suites/${suite.id}/run`)}
                    >
                      ▶️ Run
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/collections/${collection.id}/suites/${suite.id}`)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveSuite(suite.id)}>
                      🗑️ Remove
                    </Button>
                  </SuiteActions>
                </SuiteHeader>

                <SuiteStats>
                  <StatBadge>🎯 {suite.steps?.length || 0} steps</StatBadge>
                  <StatBadge>⚡ {suite.metadata?.priority || 'medium'}</StatBadge>
                  {suite.metadata?.tags && <StatBadge>🏷️ {suite.metadata.tags.join(', ')}</StatBadge>}
                </SuiteStats>
              </SuiteCard>
            ))}
          </SuitesList>
        )}
      </SuitesSection>

      {/* Edit Collection Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <ModalTitle>Edit Collection</ModalTitle>

          <Input
            label="Collection Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Enter collection name"
          />

          <Input
            label="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Enter description (optional)"
          />

          <ModalActions>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEdit} disabled={!editedName.trim()}>
              Save Changes
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          <ModalTitle>Delete Collection</ModalTitle>

          <p style={{ color: 'var(--secondary-text)' }}>
            Are you sure you want to delete &quot;{collection.name}&quot;?
            <br />
            This will remove all test suites from this collection.
            <br />
            <strong>This action cannot be undone.</strong>
          </p>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={handleDelete} style={{ color: 'var(--text-danger)' }}>
              Delete Collection
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Add Suite Modal */}
      <Modal isOpen={isAddSuiteModalOpen} onClose={() => setIsAddSuiteModalOpen(false)}>
        <ModalContent>
          <ModalTitle>Add Test Suite</ModalTitle>

          <Input
            label="Suite File Path"
            value={newSuitePath}
            onChange={(e) => setNewSuitePath(e.target.value)}
            placeholder="e.g., tests/api/auth.yaml"
          />

          <p style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
            Enter the path to a YAML test suite file. You can browse and select files in the next sprint.
          </p>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddSuiteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSuite} disabled={!newSuitePath.trim()}>
              Add Suite
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </DetailWrapper>
  );
}
