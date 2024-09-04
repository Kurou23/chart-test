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
    start: new Date(2024, 1, 1),
    end: new Date(2024, 6, 1),
  },
  {
    id: 2,
    name: "Sisfo PS",
    start: new Date(2024, 6, 1),
    end: new Date(2024, 12, 1),
  },
  {
    id: 3,
    name: "Binus Center",
    start: new Date(2024, 10, 1),
    end: new Date(2025, 6, 1),
  },
];

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
              <Link to="/dhtml">Ant Design Chart</Link>
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
