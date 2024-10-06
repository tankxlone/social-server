import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <ToastContainer />
      <main className="h-full max-w-6xl mx-auto flex">
        <Outlet />
      </main>
    </>
  );
}

export default App;
