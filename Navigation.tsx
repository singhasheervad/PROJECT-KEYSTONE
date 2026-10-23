import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role")?.toUpperCase();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        padding: "14px 32px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <strong
          style={{
            fontSize: "18px",
          }}
        >
          KEYSTONE
        </strong>

        {/* MANAGER */}
        {role === "MANAGER" && (
          <>
            <Link to="/manager">Dashboard</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/sites">Sites</Link>
            <Link to="/work-orders">Work Orders</Link>
          </>
        )}

        {/* DISPATCHER */}
        {role === "DISPATCHER" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/sites">Sites</Link>
            <Link to="/work-orders">Work Orders</Link>
          </>
        )}

        {/* TECHNICIAN */}
        {role === "TECHNICIAN" && (
          <Link to="/technician">
            Technician Workspace
          </Link>
        )}

        {/* CUSTOMER */}
        {role === "CUSTOMER" && (
          <Link to="/customer-portal">
            Customer Portal
          </Link>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontWeight: 600,
          }}
        >
          {role || "USER"}
        </span>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}