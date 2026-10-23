import { useEffect, useState } from "react";
import axios from "../api";

interface WorkOrder {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  slaDueAt?: string | null;
  customer?: {
    id: number;
    name: string;
  };
  site?: {
    id: number;
    name: string;
  };
}

interface Part {
  id: number;
  name: string;
  stockQuantity?: number;
}

interface WorkOrderPart {
  id: number;
  part?: Part;
  quantity?: number;
}

interface TimeLog {
  id: number;
  hours: number;
  description?: string;
  loggedBy?: string;
  loggedAt?: string;
}

export default function Technician() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const [parts, setParts] = useState<{
    [key: number]: WorkOrderPart[];
  }>({});

  const [timeLogs, setTimeLogs] = useState<{
    [key: number]: TimeLog[];
  }>({});

  const [partIds, setPartIds] = useState<{
    [key: number]: string;
  }>({});

  const [partQuantities, setPartQuantities] = useState<{
    [key: number]: string;
  }>({});

  const [hours, setHours] = useState<{
    [key: number]: string;
  }>({});

  const [timeDescriptions, setTimeDescriptions] = useState<{
    [key: number]: string;
  }>({});

  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setMessage(
          "Technician account ID is not available."
        );
        return;
      }

      const response = await axios.get(
        `/api/work-orders/technician/${userId}`,
        {
          headers: authHeaders,
        }
      );

      setWorkOrders(response.data || []);
    } catch (error) {
      console.error("Load technician jobs error:", error);

      if (axios.isAxiosError(error)) {
        setMessage(
          `Unable to load assigned jobs (${
            error.response?.status || "network error"
          }).`
        );
      } else {
        setMessage("Unable to load assigned jobs.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const changeStatus = async (
    id: number,
    status: string
  ) => {
    try {
      setBusyOrderId(id);
      setMessage("");

      await axios.post(
        `/api/work-orders/${id}/status`,
        null,
        {
          params: {
            status,
          },
          headers: authHeaders,
        }
      );

      await loadJobs();
    } catch (error) {
      console.error("Status update error:", error);

      if (axios.isAxiosError(error)) {
        setMessage(
          `Status update failed (${
            error.response?.status || "unknown"
          }).`
        );
      } else {
        setMessage("Status update failed.");
      }
    } finally {
      setBusyOrderId(null);
    }
  };

  const loadActivity = async (id: number) => {
    try {
      const [partsResponse, timeResponse] =
        await Promise.all([
          axios.get(
            `/api/work-orders/${id}/parts`,
            {
              headers: authHeaders,
            }
          ),
          axios.get(
            `/api/work-orders/${id}/time`,
            {
              headers: authHeaders,
            }
          ),
        ]);

      setParts((prev) => ({
        ...prev,
        [id]: partsResponse.data || [],
      }));

      setTimeLogs((prev) => ({
        ...prev,
        [id]: timeResponse.data || [],
      }));
    } catch (error) {
      console.error("Load activity error:", error);
      setMessage("Unable to load work order activity.");
    }
  };

  const toggleDetails = async (id: number) => {
    if (expandedOrder === id) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(id);
    await loadActivity(id);
  };

  const addPart = async (orderId: number) => {
    const partId = Number(partIds[orderId]);
    const quantity = Number(partQuantities[orderId]);

    if (!partId || partId <= 0) {
      setMessage("Please enter a valid Part ID.");
      return;
    }

    if (!quantity || quantity <= 0) {
      setMessage("Please enter a valid part quantity.");
      return;
    }

    try {
      setBusyOrderId(orderId);
      setMessage("");

      await axios.post(
        `/api/work-orders/${orderId}/parts`,
        {
          partId,
          quantity,
        },
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );

      setPartIds((prev) => ({
        ...prev,
        [orderId]: "",
      }));

      setPartQuantities((prev) => ({
        ...prev,
        [orderId]: "",
      }));

      await loadActivity(orderId);
    } catch (error) {
      console.error("Add part error:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
          setMessage(data);
        } else if (data?.message) {
          setMessage(data.message);
        } else {
          setMessage(
            `Unable to add part (${
              error.response?.status || "unknown"
            }).`
          );
        }
      } else {
        setMessage("Unable to add part.");
      }
    } finally {
      setBusyOrderId(null);
    }
  };

  const addTimeLog = async (orderId: number) => {
    const hoursValue = Number(hours[orderId]);
    const description =
      timeDescriptions[orderId] || "";

    if (!hoursValue || hoursValue <= 0) {
      setMessage("Please enter valid hours.");
      return;
    }

    try {
      setBusyOrderId(orderId);
      setMessage("");

      await axios.post(
        `/api/work-orders/${orderId}/time`,
        {
          hours: hoursValue,
          description,
        },
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );

      setHours((prev) => ({
        ...prev,
        [orderId]: "",
      }));

      setTimeDescriptions((prev) => ({
        ...prev,
        [orderId]: "",
      }));

      await loadActivity(orderId);
    } catch (error) {
      console.error("Add time log error:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
          setMessage(data);
        } else if (data?.message) {
          setMessage(data.message);
        } else {
          setMessage(
            `Unable to log time (${
              error.response?.status || "unknown"
            }).`
          );
        }
      } else {
        setMessage("Unable to log time.");
      }
    } finally {
      setBusyOrderId(null);
    }
  };

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Technician Workspace</h1>

        <button
          onClick={loadJobs}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {message && (
        <div
          className="login-error"
          style={{
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      {loading && (
        <p>Loading assigned jobs...</p>
      )}

      {!loading && workOrders.length === 0 && (
        <div className="list-card">
          <p>No assigned work orders.</p>
        </div>
      )}

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
                "No description"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {order.priority}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            {order.customer && (
              <p>
                <strong>Customer:</strong>{" "}
                {order.customer.name}
              </p>
            )}

            {order.site && (
              <p>
                <strong>Site:</strong>{" "}
                {order.site.name}
              </p>
            )}

            {order.slaDueAt && (
              <p>
                <strong>SLA Due:</strong>{" "}
                {order.slaDueAt}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "15px",
              }}
            >
              {order.status === "ASSIGNED" && (
                <button
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "IN_PROGRESS"
                    )
                  }
                  disabled={
                    busyOrderId === order.id
                  }
                >
                  Start Work
                </button>
              )}

              {order.status === "IN_PROGRESS" && (
                <>
                  <button
                    onClick={() =>
                      changeStatus(
                        order.id,
                        "ON_HOLD"
                      )
                    }
                    disabled={
                      busyOrderId === order.id
                    }
                  >
                    Put On Hold
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        order.id,
                        "COMPLETED"
                      )
                    }
                    disabled={
                      busyOrderId === order.id
                    }
                  >
                    Complete
                  </button>
                </>
              )}

              {order.status === "ON_HOLD" && (
                <button
                  onClick={() =>
                    changeStatus(
                      order.id,
                      "IN_PROGRESS"
                    )
                  }
                  disabled={
                    busyOrderId === order.id
                  }
                >
                  Resume Work
                </button>
              )}

              <button
                onClick={() =>
                  toggleDetails(order.id)
                }
              >
                {expandedOrder === order.id
                  ? "Hide Activity"
                  : "Parts & Time"}
              </button>
            </div>

            {/* PARTS & TIME */}
            {expandedOrder === order.id && (
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #ddd",
                }}
              >
                <h3>Parts Used</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    placeholder="Part ID"
                    value={
                      partIds[order.id] || ""
                    }
                    onChange={(e) =>
                      setPartIds((prev) => ({
                        ...prev,
                        [order.id]:
                          e.target.value,
                      }))
                    }
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    value={
                      partQuantities[order.id] ||
                      ""
                    }
                    onChange={(e) =>
                      setPartQuantities(
                        (prev) => ({
                          ...prev,
                          [order.id]:
                            e.target.value,
                        })
                      )
                    }
                  />

                  <button
                    onClick={() =>
                      addPart(order.id)
                    }
                    disabled={
                      busyOrderId === order.id
                    }
                  >
                    Add Part
                  </button>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                  }}
                >
                  {(parts[order.id] || [])
                    .length === 0 ? (
                    <p>
                      No parts logged.
                    </p>
                  ) : (
                    <ul>
                      {(parts[order.id] || []).map(
                        (item) => (
                          <li key={item.id}>
                            {item.part?.name ||
                              `Part #${item.part?.id}`}{" "}
                            — Quantity:{" "}
                            {item.quantity}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>

                <h3
                  style={{
                    marginTop: "25px",
                  }}
                >
                  Time Logging
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Hours"
                    value={hours[order.id] || ""}
                    onChange={(e) =>
                      setHours((prev) => ({
                        ...prev,
                        [order.id]:
                          e.target.value,
                      }))
                    }
                  />

                  <input
                    placeholder="Work description"
                    value={
                      timeDescriptions[
                        order.id
                      ] || ""
                    }
                    onChange={(e) =>
                      setTimeDescriptions(
                        (prev) => ({
                          ...prev,
                          [order.id]:
                            e.target.value,
                        })
                      )
                    }
                  />

                  <button
                    onClick={() =>
                      addTimeLog(order.id)
                    }
                    disabled={
                      busyOrderId === order.id
                    }
                  >
                    Log Time
                  </button>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                  }}
                >
                  {(timeLogs[order.id] || [])
                    .length === 0 ? (
                    <p>
                      No time logs yet.
                    </p>
                  ) : (
                    <ul>
                      {(timeLogs[order.id] || []).map(
                        (log) => (
                          <li key={log.id}>
                            {log.hours} hour(s)
                            {log.description
                              ? ` — ${log.description}`
                              : ""}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}