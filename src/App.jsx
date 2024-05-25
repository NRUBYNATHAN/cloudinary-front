import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Upload a file using cloudinary service in MERN stack</h1>
      <Link to="/">Home</Link> | <Link to="/upload">Upload</Link> |{" "}
      <Link to="/secure-upload">SeccureUpload</Link>
      <br />
      <br />
      <Outlet />
    </div>
  );
}

export default App;
