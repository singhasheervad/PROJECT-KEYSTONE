import { useState } from "react";
import axios from "../api";

interface Site {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function Sites() {
  const [customerId, setCustomerId] = useState("1");
  const [sites, setSites] = useState<Site[]>([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadSites = async () => {
    if (!customerId || Number(customerId) <= 0) {
      setError("Please enter a valid Customer ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/api/customers/${Number(
          customerId
        )}/sites`,
        {
          headers: authHeaders,
        }
      );

      setSites(response.data || []);
    } catch (error) {
      console.error("Load sites error:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError(
            `Unable to load sites (${
              error.response?.status || "network error"
            }).`
          );
        }
      } else {
        setError("Unable to load sites.");
      }
    } finally {
      setLoading(false);
    }
  };

  const createSite = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!customerId || Number(customerId) <= 0) {
      setError("Please enter a valid Customer ID.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      await axios.post(
        `/api/customers/${Number(
          customerId
        )}/sites`,
        {
          name,
          address,
          city,
          postalCode,
        },
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );

      setName("");
      setAddress("");
      setCity("");
      setPostalCode("");

      await loadSites();
    } catch (error) {
      console.error("Create site error:", error);

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError(
            `Unable to create site (${
              error.response?.status || "unknown"
            }).`
          );
        }
      } else {
        setError("Unable to create site.");
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
          <h1>Sites</h1>
          <p>
            Manage customer service locations.
          </p>
        </div>

        <button
          onClick={loadSites}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Sites"}
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

      {/* CUSTOMER SELECTION */}
      <div className="form-card">
        <h2 style={{ width: "100%" }}>
          Select Customer
        </h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <input
            type="number"
            min="1"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) =>
              setCustomerId(e.target.value)
            }
            style={{
              flex: "1",
              minWidth: "180px",
            }}
          />

          <button
            type="button"
            onClick={loadSites}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Load Sites"}
          </button>
        </div>
      </div>

      {/* CREATE SITE */}
      <div
        className="form-card"
        style={{
          marginTop: "20px",
        }}
      >
        <h2 style={{ width: "100%" }}>
          Add Site
        </h2>

        <form
          onSubmit={createSite}
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            placeholder="Site name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            required
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
          />

          <input
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) =>
              setPostalCode(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "Add Site"}
          </button>
        </form>
      </div>

      {/* SITE LIST */}
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
          <h2>Site List</h2>

          <strong>
            Total: {sites.length}
          </strong>
        </div>

        {loading && (
          <p>Loading sites...</p>
        )}

        {!loading && sites.length === 0 && (
          <p>
            No sites found for Customer #
            {customerId}.
          </p>
        )}

        {!loading &&
          sites.map((site) => (
            <div
              key={site.id}
              className="list-item"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "70px 1.2fr 2fr 1fr 1fr",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <strong>
                #{site.id}
              </strong>

              <strong>
                {site.name}
              </strong>

              <span>
                {site.address}
              </span>

              <span>
                {site.city || "No city"}
              </span>

              <span>
                {site.postalCode ||
                  "No postal code"}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}