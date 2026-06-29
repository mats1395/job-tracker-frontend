import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios"

import Layout from "./components/Layout.jsx";
import Login from "./Login/Register/Login.jsx";
import Signup from "./Login/Register/Signup.jsx";
import LandingPage from "./sites/LandingPage.jsx";
import Dashboard from "./sites/Dashboard.jsx";
import Profile from "./sites/Profile.jsx";
import Stats from "./sites/Stats.jsx";
import Pricing from "./sites/Pricing.jsx";
import CvBuilder from "./sites/CvBuilder.jsx";
import CvScanner from "./sites/CvScanner.jsx";
import Onboarding from "./sites/Onboarding.jsx";
import GoogleCallBack from "./Login/Register/GoogleCallBack.jsx"


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      if (!parsed || Object.keys(parsed).length === 0) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true })
    .then((res) => {
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      }
    })
    .catch(() => {
      localStorage.removeItem("user");
      setUser(null);
    });
}, []);

  // Check if the user has completed onboarding
const [hasOnboarded, setHasOnboarded] = useState(
  () => localStorage.getItem("jobtracker_onboarded") === "true"
);

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            !user
              ? <Login setUser={setUser} user={user} />
              : <Navigate to="/home" />
          }
        />

        <Route
          path="/register"
          element={
            !user
              ? <Signup setUser={setUser} user={user} />
              : <Navigate to="/home" />
          }
        />

        {/* ONBOARDING — only accessible when logged in + not yet onboarded */}
        <Route
          path="/onboarding"
          element={
            !user
              ? <Navigate to="/login" />
              : hasOnboarded
                ? <Navigate to="/home" />
                : <Onboarding onComplete={() => setHasOnboarded(true)} />
          }
        />
        <Route path="/auth/callback" element={<GoogleCallBack setUser={setUser} />} />

        {/* PROTECTED */}
        <Route
          path="/home"
          element={
            !user
              ? <Navigate to="/login" />
              : !hasOnboarded
                ? <Navigate to="/onboarding" />
                : <Layout />
          }
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="cvscanner" element={<CvScanner />} />
          <Route path="cvbuilder" element={<CvBuilder />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
