
function Home({user}) {

    function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

    return (
        <div>
            <h1>Home</h1>
            <p>Want to Log out?</p>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    )
}

export default Home 