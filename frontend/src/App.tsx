import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Sites from "./pages/Sites";
import WorkOrders from "./pages/WorkOrders";
import Technician from "./pages/Technician";
import CustomerPortal from "./pages/CustomerPortal";
import Manager from "./pages/Manager";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            LOGIN
        ========================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            DISPATCHER DASHBOARD
            MANAGER can also access
        ========================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "DISPATCHER",
                "MANAGER",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================
            CUSTOMERS
            Manager + Dispatcher
        ========================== */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute
              allowedRoles={[
                "MANAGER",
                "DISPATCHER",
              ]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* =========================
            SITES
            Manager + Dispatcher
        ========================== */}
        <Route
          path="/sites"
          element={
            <ProtectedRoute
              allowedRoles={[
                "MANAGER",
                "DISPATCHER",
              ]}
            >
              <Sites />
            </ProtectedRoute>
          }
        />

        {/* =========================
            WORK ORDERS
            Manager + Dispatcher
        ========================== */}
        <Route
          path="/work-orders"
          element={
            <ProtectedRoute
              allowedRoles={[
                "MANAGER",
                "DISPATCHER",
              ]}
            >
              <WorkOrders />
            </ProtectedRoute>
          }
        />

        {/* =========================
            TECHNICIAN WORKSPACE
        ========================== */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute
              allowedRoles={[
                "TECHNICIAN",
              ]}
            >
              <Technician />
            </ProtectedRoute>
          }
        />

        {/* =========================
            CUSTOMER PORTAL
        ========================== */}
        <Route
          path="/customer-portal"
          element={
            <ProtectedRoute
              allowedRoles={[
                "CUSTOMER",
              ]}
            >
              <CustomerPortal />
            </ProtectedRoute>
          }
        />

        {/* =========================
            MANAGER DASHBOARD
        ========================== */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute
              allowedRoles={[
                "MANAGER",
              ]}
            >
              <Manager />
            </ProtectedRoute>
          }
        />

        {/* =========================
            DEFAULT / UNKNOWN ROUTE
        ========================== */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;