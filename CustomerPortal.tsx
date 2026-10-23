import { useEffect, useState } from "react";
import axios from "../api";

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  slaDueAt: string | null;
  createdAt?: string;
  customer?: {
    id: number;
    name: string;
  };
  site?: {
    id: number;
    name: string;
    address?: string;
    city?: string;
  };
}

export default function CustomerPortal() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadOrders = async () => {
    if (!customerId) {
      setError(
        "Customer account ID is not available. Please log in again."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/api/work-orders/customer/${customerId}`,
        {
          headers: authHeaders,
        }
      );

      setWorkOrders(response.data || []);
    } catch (err) {
      console.error("Customer portal error:", err);

      if (axios.isAxiosError(err)) {
        setError(
          `Unable to load service requests (${
            err.response?.status || "network error"
          }).`
        );
      } else {
        setError("Unable to load service requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NEW":
        return "New";
      case "ASSIGNED":
        return "Assigned";
      case "IN_PROGRESS":
        return "In Progress";
      case "ON_HOLD":
        return "On Hold";
      case "COMPLETED":
        return "Completed";
      case "CLOSED":
        return "Closed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) {
      return "Not set";
    }

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Customer Portal</h1>

          <p>
            Track your service requests and work orders.
          </p>
        </div>

        <button
          onClick={loadOrders}
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
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="list-card">
          <p>Loading your service requests...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && workOrders.length === 0 && !error && (
        <div className="list-card">
          <h2>No Service Requests</h2>
          <p>
            You currently have no service requests or
            work orders.
          </p>
        </div>
      )}

      {/* WORK ORDERS */}
      {!loading && workOrders.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
              marginBottom: "25px",
            }}
          >
            <div className="list-card">
              <h3>Total Requests</h3>
              <h2>{workOrders.length}</h2>
            </div>

            <div className="list-card">
              <h3>New</h3>
              <h2>
                {
                  workOrders.filter(
                    (order) => order.status === "NEW"
                  ).length
                }
              </h2>
            </div>

            <div className="list-card">
              <h3>In Progress</h3>
              <h2>
                {
                  workOrders.filter(
                    (order) =>
                      order.status === "IN_PROGRESS"
                  ).length
                }
              </h2>
            </div>

            <div className="list-card">
              <h3>Completed</h3>
              <h2>
                {
                  workOrders.filter(
                    (order) =>
                      order.status === "COMPLETED" ||
                      order.status === "CLOSED"
                  ).length
                }
              </h2>
            </div>
          </div>

          <h2 style={{ marginBottom: "20px" }}>
            My Service Requests
          </h2>

          <div className="work-order-grid">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className="work-order-card"
              >
                <h2>
                  #{order.id} — {order.title}
                </h2>

                <p>
                  {order.description ||
                    "No description provided."}
                </p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {order.priority}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      background: "#eef3ff",
                      fontWeight: 600,
                    }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </p>

                <p>
                  <strong>Site:</strong>{" "}
                  {order.site?.name ||
                    "Not available"}
                </p>

                {order.site?.city && (
                  <p>
                    <strong>City:</strong>{" "}
                    {order.site.city}
                  </p>
                )}

                <p>
                  <strong>Created:</strong>{" "}
                  {formatDate(order.createdAt)}
                </p>

                <p>
                  <strong>SLA Due:</strong>{" "}
                  {formatDate(order.slaDueAt)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}