import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Pub, WorldMap } from "./routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<WorldMap />} />
        </Route>
        <Route path="/pub" element={<Pub />} />
      </Routes>
    </Router>
  );
}

export default App;
