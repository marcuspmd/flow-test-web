import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCollections } from '../hooks';
import { Button, Input, Modal } from '../components';

const CollectionsWrapper = styled.div`
  padding: 24px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme['primary-text']};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 24px;
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const CollectionCard = styled.div<{ $isActive?: boolean }>`
  background: ${({ theme }) => theme['sidebar-background']};
  border: 2px solid ${({ theme, $isActive }) => ($isActive ? theme.brand : theme['layout-border'])};
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.brand};
  }
`;

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CollectionName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme['primary-text']};
  margin-bottom: 4px;
`;

const CollectionDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CollectionStats = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme['secondary-text']};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme['primary-text']};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme['primary-text']};
  background: ${({ theme }) => theme['codemirror-background']};
  border: 1px solid ${({ theme }) => theme['layout-border']};
  border-radius: 4px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.brand};
  }
`;

/**
 * Collections Page - Lista e gerencia coleções de testes
 */
export default function CollectionsPage() {
  const navigate = useNavigate();
  const { collections, activeCollectionId, setActiveCollection, addCollection, deleteCollection } = useCollections();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      id: crypto.randomUUID(),
      name: newCollectionName,
      description: newCollectionDescription || undefined,
      suites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addCollection(newCollection);
    setActiveCollection(newCollection.id);

    // Reset form
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowCreateModal(false);
  };

  const handleDeleteCollection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
    }
  };

  return (
    <CollectionsWrapper>
      <Header>
        <Title>Collections</Title>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + New Collection
        </Button>
      </Header>

      {collections.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyTitle>No collections yet</EmptyTitle>
          <EmptyDescription>Create your first collection to organize your API test suites</EmptyDescription>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create Collection
          </Button>
        </EmptyState>
      ) : (
        <CollectionGrid>
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              $isActive={collection.id === activeCollectionId}
              onClick={() => {
                setActiveCollection(collection.id);
                navigate(`/collections/${collection.id}`);
              }}
            >
              <CollectionHeader>
                <CollectionName>{collection.name}</CollectionName>
                <Button variant="ghost" size="sm" onClick={(e) => handleDeleteCollection(collection.id, e)}>
                  🗑️
                </Button>
              </CollectionHeader>

              {collection.description && <CollectionDescription>{collection.description}</CollectionDescription>}

              <CollectionStats>
                <Stat>
                  <span>🧪</span>
                  <span>{collection.suites.length} suites</span>
                </Stat>
                <Stat>
                  <span>📅</span>
                  <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                </Stat>
              </CollectionStats>
            </CollectionCard>
          ))}
        </CollectionGrid>
      )}

      {/* Create Collection Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Collection"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCollection}>
              Create
            </Button>
          </>
        }
      >
        <FormGroup>
          <Label>Collection Name *</Label>
          <Input
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="e.g., User API Tests"
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            value={newCollectionDescription}
            onChange={(e) => setNewCollectionDescription(e.target.value)}
            placeholder="Optional description..."
          />
        </FormGroup>
      </Modal>
    </CollectionsWrapper>
  );
}
