import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from './routes';
import { Spinner } from '../components';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

/**
 * Routes Component - Renders configured routes
 */
function Routes() {
  const element = useRoutes(routes);
  return <>{element}</>;
}

/**
 * Router Component - Main router wrapper with suspense
 */
export function Router() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense
        fallback={
          <LoadingWrapper>
            <Spinner size="lg" />
          </LoadingWrapper>
        }
      >
        <Routes />
      </Suspense>
    </BrowserRouter>
  );
}
