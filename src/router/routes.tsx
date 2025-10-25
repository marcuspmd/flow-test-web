import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load pages for code splitting
const MainWorkspace = lazy(() => import('../pages/MainWorkspace'));
const CollectionsPage = lazy(() => import('../pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('../pages/CollectionDetailPage'));
const SuiteEditorPage = lazy(() => import('../pages/SuiteEditorPage'));
const TestRunnerPage = lazy(() => import('../pages/TestRunnerPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const APIClientPage = lazy(() => import('../pages/APIClientPage'));
const NewTestSuitePage = lazy(() => import('../pages/NewTestSuitePage'));

/**
 * Application Routes Configuration
 * Uses lazy loading for optimal performance
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainWorkspace />,
  },
  {
    path: '/new-test',
    element: (
      <MainWorkspace>
        <NewTestSuitePage />
      </MainWorkspace>
    ),
  },
  {
    path: '/collections',
    element: (
      <MainWorkspace>
        <CollectionsPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/collections/:id',
    element: (
      <MainWorkspace>
        <CollectionDetailPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/collections/:collectionId/suites/new',
    element: (
      <MainWorkspace>
        <SuiteEditorPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/collections/:collectionId/suites/:suiteId',
    element: (
      <MainWorkspace>
        <SuiteEditorPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/collections/:collectionId/run',
    element: (
      <MainWorkspace>
        <TestRunnerPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/collections/:collectionId/suites/:suiteId/run',
    element: (
      <MainWorkspace>
        <TestRunnerPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/settings',
    element: (
      <MainWorkspace>
        <SettingsPage />
      </MainWorkspace>
    ),
  },
  {
    path: '/api-client',
    element: (
      <MainWorkspace>
        <APIClientPage />
      </MainWorkspace>
    ),
  },

  // Catch-all route - redirect to home
  {
    path: '*',
    element: <MainWorkspace />,
  },
];
