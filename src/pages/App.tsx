import { ThemeProvider } from '../providers/ThemeProvider';
import { ReduxProvider } from '../providers/ReduxProvider';
import { ToastProvider, ElectronBanner } from '../components';
import { Router } from '../router';

import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';

function App() {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ElectronBanner />
        <ToastProvider maxToasts={5}>
          <Router />
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
