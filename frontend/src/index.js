import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App';
import { LeadsContextProvider } from './context/LeadsContext';
import { AuthContextProvider } from './context/AuthContext';
import { UsersContextProvider } from './context/UsersContext';
import { EmailsContextProvider } from './context/EmailsContext';
import { ServicesContextProvider } from './context/ServicesContext';
import { AdminContextProvider } from './context/AdminContext';
import { LeadgenContextProvider } from './context/LeadgenContext';
import { TemplatesContextProvider } from './context/TemplatesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <AdminContextProvider>
        <ServicesContextProvider>
          <EmailsContextProvider>
            <UsersContextProvider>
              <LeadgenContextProvider>
                <LeadsContextProvider>
                  <TemplatesContextProvider>
                    <App />
                  </TemplatesContextProvider>
                </LeadsContextProvider>
              </LeadgenContextProvider>
            </UsersContextProvider>
          </EmailsContextProvider>
        </ServicesContextProvider>
      </AdminContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
