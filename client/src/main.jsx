import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/index.css'
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from "./services/authContext";

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AuthProvider>
  </Provider>
);
