import { useAppSelector, useAppDispatch } from '../store';
import {
  addCollection,
  updateCollection,
  deleteCollection,
  addTestSuite,
  updateTestSuite,
  deleteTestSuite,
  setActiveCollection,
  setActiveSuite,
  setActiveStep,
  Collection,
  TestSuite,
} from '../store/store.exports';

/**
 * Hook customizado para gerenciar coleções de testes
 * Fornece acesso fácil ao estado de collections e suas actions
 */
export const useCollections = () => {
  const dispatch = useAppDispatch();
  const collectionsState = useAppSelector((state) => state.collections);

  return {
    // State
    collections: collectionsState.collections,
    activeCollectionId: collectionsState.activeCollectionId,
    activeSuiteId: collectionsState.activeSuiteId,
    activeStepId: collectionsState.activeStepId,
    isLoading: collectionsState.isLoading,
    error: collectionsState.error,

    // Computed
    activeCollection: collectionsState.collections.find((c) => c.id === collectionsState.activeCollectionId),
    activeSuite: collectionsState.collections
      .flatMap((c) => c.suites)
      .find((s) => s.id === collectionsState.activeSuiteId),

    // Actions - Collections
    addCollection: (collection: Collection) => dispatch(addCollection(collection)),
    updateCollection: (id: string, updates: Partial<Collection>) => dispatch(updateCollection({ id, updates })),
    deleteCollection: (id: string) => dispatch(deleteCollection(id)),

    // Actions - Test Suites
    addTestSuite: (collectionId: string, suite: TestSuite) => dispatch(addTestSuite({ collectionId, suite })),
    updateTestSuite: (collectionId: string, suiteId: string, updates: Partial<TestSuite>) =>
      dispatch(updateTestSuite({ collectionId, suiteId, updates })),
    deleteTestSuite: (collectionId: string, suiteId: string) => dispatch(deleteTestSuite({ collectionId, suiteId })),

    // Actions - Selection
    setActiveCollection: (id: string | null) => dispatch(setActiveCollection(id)),
    setActiveSuite: (id: string | null) => dispatch(setActiveSuite(id)),
    setActiveStep: (id: string | null) => dispatch(setActiveStep(id)),
  };
};
