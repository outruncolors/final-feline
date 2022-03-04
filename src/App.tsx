import "./App.css";
import "antd/dist/antd.css";
import { Layout, Wrapper } from "./components";
import { state } from "./state";

function App() {
  return (
    <Layout>
      <Wrapper state={state} />
    </Layout>
  );
}

export default App;
