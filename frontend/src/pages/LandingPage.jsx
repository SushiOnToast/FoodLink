import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Food for everyone!</h1>
      <button className="login-button" onClick={() => navigate("/login")}>
        Login
      </button>
      <button className="register-button" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}

export default LandingPage;
