import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Arena,
  Beach,
  Cave,
  Forest,
  Housing,
  Market,
  Mountain,
  Pub,
  Shop,
  Valley,
  WorldMap,
  Google
} from "./routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<WorldMap />} />
        </Route>
        <Route path="/arena" element={<Arena />} />
        <Route path="/beach" element={<Beach />} />
        <Route path="/cave" element={<Cave />} />
        <Route path="/forest" element={<Forest />} />
        <Route path="/housing" element={<Housing />} />
        <Route path="/market" element={<Market />} />
        <Route path="/mountain" element={<Mountain />} />
        <Route path="/pub" element={<Pub />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/valley" element={<Valley />} />
        <Route path="/google" element={<Google />} />
      </Routes>
    </Router>
  );
}

export default App;
