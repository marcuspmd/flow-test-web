import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TestRunner } from '../components';
import { useCollections } from '../hooks/useCollections';

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme['codemirror-background']};
`;

const PageHeader = styled.div`
  padding: 20px 24px;
  background: ${({ theme }) => theme['sidebar-background']};
  border-bottom: 1px solid ${({ theme }) => theme['layout-border']};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.brand};
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme['secondary-text']};
`;

const RunnerContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow: hidden;
`;

/**
 * TestRunnerPage
 * Page for executing test suites
 */
export const TestRunnerPage = () => {
  const { collectionId, suiteId } = useParams<{ collectionId: string; suiteId?: string }>();
  const { collections } = useCollections();

  // Find collection and suite
  const collection = collections.find((c) => c.id === collectionId);
  const suite = suiteId ? collection?.suites.find((s) => s.id === suiteId) : null;

  const handleComplete = (success: boolean) => {
    console.log(`Test execution ${success ? 'succeeded' : 'failed'}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>🚀 Test Runner</Title>
        <Subtitle>
          {suite
            ? `Running suite: ${suite.suite_name}`
            : collection
              ? `Running all tests in: ${collection.name}`
              : 'Test Execution'}
        </Subtitle>
      </PageHeader>

      <RunnerContent>
        <TestRunner collectionId={collectionId} suiteId={suiteId} onComplete={handleComplete} />
      </RunnerContent>
    </PageContainer>
  );
};

export default TestRunnerPage;
