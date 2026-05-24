import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { projectAPI } from "../services/api";

const MainLayout = ({ children }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectAPI.getAll().then(({ data }) => setProjects(data)).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar projects={projects} />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--bg-page)" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
