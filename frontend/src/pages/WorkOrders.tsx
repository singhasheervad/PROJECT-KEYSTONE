import { useEffect, useState } from "react";
import axios from "axios";

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
  };

  assignedTechnician?: {
    id: number;
    name: string;
    email?: string;
  };
}

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [customerId, setCustomerId] = useState("1");
  const [siteId, setSiteId] = useState("1");
  const [slaDueAt, setSlaDueAt] = useState("");

  const [technicianIds, setTechnicianIds] = useState<{
    [key: number]: string;
  }>({});

  const [assigningId, setAssigningId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8080/api/work-orders?page=0&size=50",
        {
          headers: authHeaders,
        }
      );

      setWorkOrders(response.data.content || []);
    } catch (err) {
      console.error("Work order load error:", err);

      if (axios.isAxiosError(err)) {
        setError(
          `Unable to load work orders (${
            err.response?.status || "network error"
          })`
        );
      } else {
        setError("Unable to load work orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const createWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      await axios.post(
      `http://localhost:8080/api/work-orders/${workOrderId}/assign?technicianId=${Number(
           technicianId
      )}`,
       null,
      {
        headers: authHeaders,
      }
);

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setCustomerId("1");
      setSiteId("1");
      setSlaDueAt("");

      await loadWorkOrders();
    } catch (err) {
      console.error("Create work order error:", err);

      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;

        if (typeof responseData === "string") {
          setError(responseData);
        } else if (responseData?.message) {
          setError(responseData.message);
        } else {
          setError(
            `Unable to create work order (${
              err.response?.status || "unknown"
            })`
          );
        }
      } else {
        setError("Unable to create work order.");
      }
    }
  };

  const assignTechnician = async (workOrderId: number) => {
    const technicianId = technicianIds[workOrderId];

    if (!technicianId || Number(technicianId) <= 0) {
      setError("Please enter a valid Technician ID.");
      return;
    }

    try {
      setAssigningId(workOrderId);
      setError("");

      await axios.post(
        `http://localhost:8080/api/work-orders/${workOrderId}/assign`,
        {
          technicianId: Number(technicianId),
        },
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );

      await loadWorkOrders();
    } catch (err) {
      console.error("Assign technician error:", err);

      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;

        if (typeof responseData === "string") {
          setError(responseData);
        } else if (responseData?.message) {
          setError(responseData.message);
        } else {
          setError(
            `Unable to assign technician (${
              err.response?.status || "unknown"
            })`
          );
        }
      } else {
        setError("Unable to assign technician.");
      }
    } finally {
      setAssigningId(null);
    }
  };

  const canAssign = (status: string) => {
    return (
      status !== "COMPLETED" &&
      status !== "CLOSED" &&
      status !== "CANCELLED"
    );
  };

  return (
    <div className="page">
      <h1>Work Orders</h1>

      {/* CREATE WORK ORDER */}
      <div className="form-card">
        <h2 style={{ width: "100%" }}>Create Work Order</h2>

        <form
          onSubmit={createWorkOrder}
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            placeholder="Work order title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />

          <input
            placeholder="Site ID"
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            required
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <input
            type="datetime-local"
            value={slaDueAt}
            onChange={(e) => setSlaDueAt(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              gridColumn: "1 / -1",
              resize: "vertical",
            }}
          />

          <button type="submit">
            Create Work Order
          </button>
        </form>
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

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>All Work Orders</h2>

        <button onClick={loadWorkOrders}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading work orders...</p>}

      {!loading && workOrders.length === 0 && (
        <div className="list-card">
          <p>
            No work orders found. Create your first
            work order above.
          </p>
        </div>
      )}

      {/* WORK ORDER LIST */}
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
              {order.description || "No description"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {order.priority}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <p>
              <strong>Customer:</strong>{" "}
              {order.customer?.name ||
                "Customer #" + order.customer?.id}
            </p>

            <p>
              <strong>Site:</strong>{" "}
              {order.site?.name ||
                "Site #" + order.site?.id}
            </p>

            <p>
              <strong>SLA Due:</strong>{" "}
              {order.slaDueAt || "Not set"}
            </p>

            <p>
              <strong>Technician:</strong>{" "}
              {order.assignedTechnician?.name ||
                "Not assigned"}
            </p>

            {/* ASSIGN TECHNICIAN */}
            {canAssign(order.status) && (
              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "15px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                  }}
                >
                  Assign Technician
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    placeholder="Technician ID"
                    value={technicianIds[order.id] || ""}
                    onChange={(e) =>
                      setTechnicianIds((previous) => ({
                        ...previous,
                        [order.id]: e.target.value,
                      }))
                    }
                    style={{
                      flex: "1",
                      minWidth: "150px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      assignTechnician(order.id)
                    }
                    disabled={
                      assigningId === order.id
                    }
                  >
                    {assigningId === order.id
                      ? "Assigning..."
                      : "Assign"}
                  </button>
                </div>

                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: "#666",
                  }}
                >
                  Enter the ID of a user whose role is
                  TECHNICIAN.
                </small>
              </div>
            )}

            {/* STATUS BADGE */}
            <div
              style={{
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background: "#eef3ff",
                  fontWeight: 600,
                }}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}