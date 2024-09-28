import { USER_ROLE } from "../../constants";

function Home() {
  const isRecipient = localStorage.getItem(USER_ROLE) === "recipient";

  return (
    <div className="home-page">
      <h1>Home</h1>
      {isRecipient ? (<p>Recipient</p>) : (<p>Donor</p>)}
    </div>
  );
}

export default Home;
