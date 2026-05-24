import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import Clients from "./pages/clients";
import AdminClients from "./pages/adminClients";
import { RoleBasedRoute } from "./components/RoleBasedRoute";
import { AppThemeProvider } from "./context/ThemeContext"; 

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <AppThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
        
        {/* ✅ المسار المحدد يجب أن يأتي قبل المسار العام "*" */}
        <Route
          path="/admin/clients"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminClients />
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />
        
        {/* ✨ أخيراً، المسار العام (يجب أن يكون آخر Route) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </AppThemeProvider>
  );
}

export default App;