import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from './App';
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./index.css";
import reportWebVitals from './reportWebVitals';
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import SignupScreen from "./screens/SignupScreen.jsx";
import UserScreen from "./screens/UserScreen.jsx";
import store from "./store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      {/*Private Route*/}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/users/:id" element={<UserScreen />} />
      </Route>
    </Route>
  )
);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
