import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnalyzePage />} />
      </Routes>
    </Router>
  );
}

export default App;
