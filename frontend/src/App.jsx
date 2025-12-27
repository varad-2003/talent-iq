import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProblemsPage from "./pages/ProblemsPage";
import { Toaster } from "react-hot-toast";

function App() {
  const { isSignedIn } = useUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/problem-page"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
