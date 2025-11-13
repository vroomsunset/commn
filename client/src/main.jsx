import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'
// import { authcontext } from './context/authcontext.jsx';

const client = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <QueryClientProvider client={client}>
  {/*<authcontext>*/}
    <App />
  {/*</authcontext>*/}
  </QueryClientProvider>
  </StrictMode>,
)
