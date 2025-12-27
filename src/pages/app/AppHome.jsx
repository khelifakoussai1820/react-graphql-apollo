import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function AppHome() {
  const { isAuthed } = useAuth();
  if (isAuthed) return <Navigate to="/app" replace />;

  return (
    <div className="form">
      <h1 className="title">mini notion</h1>
      <p className="helper">login to open your workspaces</p>

      <a className="btn btnPrimary" href="/auth/login">login</a>
      <a className="btn btnSecondary" href="/auth/signup">create account</a>

      <div className="helper">
        api:
        <div>{(import.meta.env.VITE_API_BASE || "http://localhost:3000")}</div>
        graphql:
        <div>{(import.meta.env.VITE_GQL_URL || "http://localhost:3000/graphql")}</div>
      </div>
    </div>
  );
}
