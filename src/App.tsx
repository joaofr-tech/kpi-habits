import { HabitsProvider } from "./context/HabitsContext";
import { GoalsProvider } from "./context/GoalsContext";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { Methodology } from "./pages/Methodology";

export default function App() {
  const page = window.location.pathname === "/metodologia"
    ? <Methodology />
    : window.location.pathname === "/metas"
      ? <Goals />
      : <Dashboard />;

  return (
    <HabitsProvider>
      <GoalsProvider>{page}</GoalsProvider>
    </HabitsProvider>
  );
}
