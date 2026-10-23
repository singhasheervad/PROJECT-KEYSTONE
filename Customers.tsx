import { useEffect, useState } from "react";
import axios from "../api";

interface Customer {
  id: number;
  name: string;
  contactEmail: string;
  phone: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/api/customers",
        {
          headers: authHeaders,
        }
      );

      setCustomers(response.data || []);
    } catch (error) {
      console.error("Load customers error:", error);

      if (axios.isAxiosError(error)) {
        setError(
          `Unable to load customers (${
            error.response?.status || "network error"
          }).`
        );
      } else {
        setError("Unable to load customers.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const createCustomer = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      await axios.post(
        "/api/customers",
        {
          name,
          contactEmail,
          phone,
        },
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );

      setName("");
      setContactEmail("");
      setPhone("");

      await loadCustomers();
    } catch (error) {
      console.error("Create customer error:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError(
            `Unable to create customer (${
              error.response?.status || "unknown"
            }).`
          );
        }
      } else {
        setError("Unable to create customer.");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>Customers</h1>
          <p>Manage customer organizations and contact details.</p>
        </div>

        <button
          onClick={loadCustomers}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

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

      <div className="form-card">
        <h2 style={{ width: "100%" }}>
          Add Customer
        </h2>

        <form
          onSubmit={createCustomer}
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            placeholder="Customer name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Contact email"
            value={contactEmail}
            onChange={(e) =>
              setContactEmail(e.target.value)
            }
            required
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "Add Customer"}
          </button>
        </form>
      </div>

      <div
        className="list-card"
        style={{
          marginTop: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "15px",
          }}
        >
          <h2>Customer List</h2>

          <strong>
            Total: {customers.length}
          </strong>
        </div>

        {loading && (
          <p>Loading customers...</p>
        )}

        {!loading && customers.length === 0 && (
          <p>No customers found.</p>
        )}

        {!loading &&
          customers.map((customer) => (
            <div
              key={customer.id}
              className="list-item"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "80px 1.5fr 1.5fr 1fr",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <strong>
                #{customer.id}
              </strong>

              <strong>
                {customer.name}
              </strong>

              <span>
                {customer.contactEmail}
              </span>

              <span>
                {customer.phone || "No phone"}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}