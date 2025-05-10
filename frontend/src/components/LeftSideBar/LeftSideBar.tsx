import React from "react";
import { Link } from "react-router-dom";
import "./LeftSideBar.css";

interface SidebarProps {
  courseTitle?: string;
}

const LeftSideBar: React.FC<SidebarProps> = ({ courseTitle }) => {
  return (
    <div className="left-sidebar">
      <div className="sidebar-course-name">
        {courseTitle || "Course"}
      </div>
      <ul className="sidebar-links">
        <li><a href="#video">▶ Preview Video</a></li>
        <li><a href="#learn">📘 What You'll Learn</a></li>
        <li><a href="#contents">📂 Course Contents</a></li>
        <li><Link to="/courses">← Back to Courses</Link></li>
      </ul>
    </div>
  );
};

export default LeftSideBar;
