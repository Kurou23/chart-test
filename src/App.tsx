// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GoogleChartsPage from "./pages/GoogleChartsPage";
import DhtmlxGanttPage from "./pages/DhtmlxGanttPage";
import D3Page from "./pages/D3Page";

const data = [
  {
    id: 1,
    name: "Sisfo CE",
    start: "2024-01-15", // ISO date string for January 15, 2024
    end: "2024-03-25",   // ISO date string for March 25, 2024
  },
  {
    id: 2,
    name: "Sisfo PS",
    start: "2024-06-15",
    end: "2024-11-15",
  },
  {
    id: 3,
    name: "Binus Center",
    start: "2024-05-12",
    end:  "2024-07-15",
  },
  {
    id: 4,
    name: "Task 4",
    start: "2025-01-12",
    end: "2025-04-23",
  },
  {
    id: 5,
    name: "Task 5",
    start: "2024-10-01",
    end: "2025-05-15",
  },
  {
    id: 6,
    name: "Task 6",
    start: "2025-04-01",
    end: "2025-06-01",
  },
];

// console.log(data);

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ margin: "50px" }}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/google-charts">Google Charts</Link>
            </li>
            <li>
              <Link to="/d3">D3.js</Link>
            </li>
            <li>
              <Link to="/dhtml">Dhtmlx Chart</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to the Chart Testing App</h1>} />
          <Route
            path="/google-charts"
            element={<GoogleChartsPage tasks={data} />}
          />
         
          <Route path="/d3" element={<D3Page data={data} />} />
          <Route path="/dhtml" element={<DhtmlxGanttPage tasks={data} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
