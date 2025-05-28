import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BossPage from "./pages/BossPage";
import JudgeScoringPage from "./pages/JudgeScoringPage";
import Checking from "./pages/Checking";
import UncheckedList from "./pages/UncheckedList";

function App() {
  return (

    <Routes>
      <Route path="/" element={<Checking />} />
      <Route path="/Uncheck" element={<UncheckedList />} />
      <Route path="/judge/:id" element={<JudgeScoringPage />} />
    </Routes>
  );
}
export default App;
