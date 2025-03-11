import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import SignIn from "./pages/SignInPage/SignIn";
import SignUp from "./pages/SignUpPage/SignUp";

// Components
import Navbar from "./components/Navbar/Navbar";
import DataBox from "./components/Databox/Databox";
import Recdatabox from "./components/Recdatabox/Recdatabox";
import SearchBar from "./components/Searchbar/Searchbar";
import LeftSideBar from "./components/LeftSideBar/LeftSideBar";
import ErrorBox from "./components/Errorbox/Errorbox";

const App: React.FC = () => {
  // Track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Track errors (for ErrorBox)
  const [hasError, setHasError] = useState<boolean>(false);

  // Example data for DataBox / Recdatabox
  const data = [
    { label: "Total Courses", value: 120 },
    { label: "Total Students", value: 5000 },
    { label: "Active Users", value: 2000 },
  ];

  // Handle sign-in (e.g., from SignIn page)
  const handleSignIn = (email: string, password: string) => {
    console.log("Signing in with:", email, password);
    // Insert authentication logic here
    setIsAuthenticated(true);
  };

  // Handle sign-up (e.g., from SignUp page)
  const handleSignUp = (name: string, email: string, password: string) => {
    console.log("Signing up with:", name, email, password);
    // Insert sign-up logic here
    setIsAuthenticated(true);
  };

  // Handle search queries from SearchBar
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  // Handle retry in ErrorBox
  const retryAction = () => {
    console.log("Retrying...");
    setHasError(false);
  };

  return (
    <Routes>
      {/** 1) Landing Page at root "/" */}
      <Route path="/" element={<LandingPage />} />

      {/** 2) Sign In Page => "/signin"
           If authenticated, redirect to Dashboard */}
      <Route
        path="/signin"
        element={
          !isAuthenticated ? (
            <SignIn onSignIn={handleSignIn} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/** 3) Sign Up Page => "/register"
           Triggered by "Register Now" link in Navbar */}
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <SignUp onSignUp={handleSignUp} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/** 4) Dashboard => only visible if authenticated */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <div style={{ display: "flex" }}>
              <LeftSideBar />

              <div style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
                <Navbar />
                <h1>Welcome to getSuited!</h1>

                <SearchBar onSearch={handleSearch} />

                {/** Conditionally show an ErrorBox */}
                {hasError && (
                  <ErrorBox
                    message="Something went wrong. Please try again."
                    retryAction={retryAction}
                  />
                )}

                {/** Example Data */}
                <DataBox
                  header="Dashboard Summary"
                  data={data}
                  footerText="View Details"
                  footerLink="/dashboard"
                />
                <Recdatabox
                  header="Another Dashboard Summary"
                  data={data}
                  footerText="View More"
                  footerLink="/dashboard-more"
                />
              </div>
            </div>
          ) : (
            // Not authenticated => redirect to /signin
            <Navigate to="/signin" replace />
          )
        }
      />

      {/** 5) Catch-all => redirect unknown paths to "/" */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
