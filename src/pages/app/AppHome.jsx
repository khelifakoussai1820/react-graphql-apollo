import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/* =======================
   Inline modern styles
======================= */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#0f172a",
  },

  helper: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "28px",
  },

  buttonPrimary: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    marginBottom: "12px",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: "600",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },

  buttonSecondary: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
  },

  envBox: {
    marginTop: "28px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#475569",
    textAlign: "left",
  },

  envLabel: {
    fontWeight: "600",
    marginTop: "8px",
  },
};

/* =======================
        Component
======================= */
export default function AppHome() {
  const { isAuthed } = useAuth();

  if (isAuthed) return <Navigate to="/app" replace />;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Mini Notion</h1>
        <p style={styles.helper}>Login to open your workspaces</p>

        <a style={styles.buttonPrimary} href="/auth/login">
          Login
        </a>

        <a style={styles.buttonSecondary} href="/auth/signup">
          Create account
        </a>

        <div style={styles.envBox}>
          <div style={styles.envLabel}>API</div>
          <div>
            {import.meta.env.VITE_API_BASE ||
              "http://localhost:8080/api/v1"}
          </div>

          <div style={styles.envLabel}>GraphQL</div>
          <div>
            {import.meta.env.VITE_GQL_URL ||
              "http://localhost:8080/graphql"}
          </div>
        </div>
      </div>
    </div>
  );
}
