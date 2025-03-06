import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DataBox from "./components/Databox/Databox";
import Recdatabox from "./components/Recdatabox/Recdatabox";
import SearchBar from "./components/Searchbar/Searchbar";
import LeftSideBar from "./components/LeftSideBar/LeftSideBar";
import ErrorBox from "./components/Errorbox/Errorbox"; // Import ErrorBox

const App: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false);

  const data = [
    { label: "Total Courses", value: 120 },
    { label: "Total Students", value: 5000 },
    { label: "Active Users", value: 2000 }
  ];

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const retryAction = () => {
    console.log("Retrying...");
    setHasError(false); // Reset the error
  };

  return (
    <div style={{ display: "flex" }}>
      {/* LeftSideBar Component */}
      <LeftSideBar />

      {/* Main Content Area */}
      <div style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
        <Navbar />
        <h1>Welcome to getSuited!</h1>

        {/* SearchBar Component */}
        <SearchBar onSearch={handleSearch} />

        {/* Conditionally render ErrorBox if there's an error */}
        {hasError && <ErrorBox message="Something went wrong. Please try again." retryAction={retryAction} />}

        {/* DataBox Component */}
        <DataBox
          header="Dashboard Summary"
          data={data}
          footerText="View Details"
          footerLink="/dashboard"
        />

        {/* Recdatabox Component */}
        <Recdatabox
          header="Another Dashboard Summary"
          data={data}
          footerText="View More"
          footerLink="/dashboard-more"
        />
      </div>
    </div>
  );
};

export default App;