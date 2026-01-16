import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  ClerkLoaded,
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
import Dashboard from "./pages/Dashboard";
import ProblemPage from "./pages/ProblemPage";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  if(!isLoaded) return null
  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/problem-page"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route
          path="/problem-page/:id"
          element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />  
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
