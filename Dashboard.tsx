import { useEffect, useState } from "react";
import axios from "../api";

interface Summary {
  total: number;
  newCount: number;
  assigned: number;
  inProgress: number;
  onHold: number;
  completed: number;
  closed: number;
  cancelled: number;
  overdue: number;
  slaCompliancePercentage: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/api/reports/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">

      <header className="topbar">
        <div>
          <h1>KEYSTONE</h1>
          <span>Operations Dashboard</span>
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        <h2>Dashboard</h2>

        {!summary ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="stats-grid">

            <div className="stat-card">
              <h3>Total Work Orders</h3>
              <strong>{summary.total}</strong>
            </div>

            <div className="stat-card">
              <h3>New</h3>
              <strong>{summary.newCount}</strong>
            </div>

            <div className="stat-card">
              <h3>Assigned</h3>
              <strong>{summary.assigned}</strong>
            </div>

            <div className="stat-card">
              <h3>In Progress</h3>
              <strong>{summary.inProgress}</strong>
            </div>

            <div className="stat-card">
              <h3>On Hold</h3>
              <strong>{summary.onHold}</strong>
            </div>

            <div className="stat-card">
              <h3>Completed</h3>
              <strong>{summary.completed}</strong>
            </div>

            <div className="stat-card">
              <h3>Closed</h3>
              <strong>{summary.closed}</strong>
            </div>

            <div className="stat-card">
              <h3>Cancelled</h3>
              <strong>{summary.cancelled}</strong>
            </div>

            <div className="stat-card">
              <h3>Overdue</h3>
              <strong>{summary.overdue}</strong>
            </div>

            <div className="stat-card">
              <h3>SLA Compliance</h3>
              <strong>
                {summary.slaCompliancePercentage}%
              </strong>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}