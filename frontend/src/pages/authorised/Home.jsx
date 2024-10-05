import tokens from "../../constants";

function Home() {
  const isRecipient = localStorage.getItem(tokens.USER_ROLE) === "recipient";

  return (
    <div className="home-page">
      <h1>Home</h1>
      {isRecipient ? (<p>Recipient</p>) : (<p>Donor</p>)}
    </div>
  );
}

export default Home;
