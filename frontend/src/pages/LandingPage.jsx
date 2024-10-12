import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import icon from  "../../favicon.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="title-container">
        <img src={icon} alt="foodlink icon" />
        <h1 className="foodlink-landing">FoodLink</h1>
      </div>
      <div className="slogan">A meal for everyone.</div>
      <div className="landing-buttons">
        <button className="auth-options" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="auth-options" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
      <div className="extra-info">
        <h2>🔗 Links 🔗</h2>
        <p>
          Be sure to
          <a href="https://devpost.com/software/foodlink-7p6xym">
            {" "}
            vote for FoodLink on Devpost
          </a>
          !
        </p>
        <a href="https://github.com/SushiOnToast/FoodLink">
          <p>Check out our code on Github!</p>
        </a>
        <p>
          Explore our{" "}
          <a href="https://adorable-rook-1b6.notion.site/Foodlink-User-Documentation-11c89fe1340080a8933cf368e6a8bf02">
            user documentation
          </a>
          !
        </p>
        <p>
          Explore the{" "}
          <a href="https://www.figma.com/proto/ZQxd67WIsR2CTx7SgZFexv/Foodlink-main?page-id=0%3A1&node-id=0-25&node-type=canvas&viewport=335%2C399%2C0.03&t=wAVQS0nWIcbysccO-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=0%3A25">
            full design with our Figma prototype
          </a>
          !
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
