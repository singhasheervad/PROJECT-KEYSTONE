import { useEffect, useState } from "react";
import axios from "../api";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

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

export default function Manager() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/api/reports/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          `Unable to load dashboard (${
            error.response?.status || "network error"
          }).`
        );
      } else {
        setError("Unable to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);



  const getSlaMessage = () => {
    if (!summary) {
      return "";
    }

    if (summary.slaCompliancePercentage >= 90) {
      return "SLA performance is excellent.";
    }

    if (summary.slaCompliancePercentage >= 75) {
      return "SLA performance needs some attention.";
    }

    return "SLA performance requires immediate attention.";
  };

  return (
    <div className="dashboard-page">

      {/* TOP BAR */}
      <header className="topbar">
        <div>
          <h1>KEYSTONE</h1>
          <span>Manager Dashboard</span>
        </div>

      </header>

      {/* COMMON NAVIGATION */}
      <Navigation />

      {/* MAIN CONTENT */}
      <main className="dashboard-content">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2>Operations Overview</h2>

            <p>
              Monitor work orders, SLA performance,
              and field-service activity.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="login-error"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div
            className="list-card"
            style={{
              marginTop: "20px",
            }}
          >
            <p>Loading dashboard...</p>
          </div>
        )}

        {/* DASHBOARD */}
        {!loading && summary && (
          <>
            {/* STATISTICS */}
            <div
              className="stats-grid"
              style={{
                marginTop: "25px",
              }}
            >
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

            {/* SLA PERFORMANCE */}
            <div
              className="list-card"
              style={{
                marginTop: "28px",
              }}
            >
              <h2>SLA Performance</h2>

              <p>
                Current SLA compliance:
                {" "}
                <strong>
                  {summary.slaCompliancePercentage}%
                </strong>
              </p>

              <p>{getSlaMessage()}</p>

              <p>
                Overdue work orders:
                {" "}
                <strong>{summary.overdue}</strong>
              </p>
            </div>

            {/* QUICK ACTIONS */}
            <div
              className="list-card"
              style={{
                marginTop: "28px",
              }}
            >
              <h2>Quick Actions</h2>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                <Link to="/customers">
                  <button>
                    Customers
                  </button>
                </Link>

                <Link to="/sites">
                  <button>
                    Sites
                  </button>
                </Link>

                <Link to="/work-orders">
                  <button>
                    Work Orders
                  </button>
                </Link>

                <Link to="/technician">
                  <button>
                    Technician Workspace
                  </button>
                </Link>

                <Link to="/customer-portal">
                  <button>
                    Customer Portal
                  </button>
                </Link>
              </div>
            </div>

            {/* WORK ORDER LIFECYCLE */}
            <div
              className="list-card"
              style={{
                marginTop: "28px",
              }}
            >
              <h2>Work Order Lifecycle</h2>

              <p>
                NEW → ASSIGNED → IN_PROGRESS →
                ON_HOLD → IN_PROGRESS → COMPLETED →
                CLOSED
              </p>

              <p>
                Cancelled work orders are handled
                separately through the backend lifecycle
                rules.
              </p>
            </div>
          </>
        )}

      </main>
    </div>
  );
}