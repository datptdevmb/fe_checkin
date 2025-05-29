import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BossPage from "./pages/BossPage";
import JudgeScoringPage from "./pages/JudgeScoringPage";
import Checking from "./pages/Checking";
import UncheckedList from "./pages/UncheckedList";
import CheckedScorePage from "./pages/CheckedScorePage";

function App() {
  return (

    <Routes>
      <Route path="/" element={<Checking />} />
      <Route path="/Uncheck" element={<UncheckedList />} />
      <Route path="/BossPage" element={<BossPage />} />
      <Route path="/judge/:id" element={<JudgeScoringPage />} />
      <Route path="/CheckedScorePage" element={<CheckedScorePage />} />
    </Routes>
  );
}
export default App;
