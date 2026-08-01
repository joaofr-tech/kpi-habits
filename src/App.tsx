import { HabitsProvider } from "./context/HabitsContext";
import { GoalsProvider } from "./context/GoalsContext";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { Methodology } from "./pages/Methodology";
import { NotFound } from "./pages/NotFound";

export default function App() {
  if (window.location.pathname === "/metodologia") {
    return <Methodology />;
  }

  if (window.location.pathname === "/metas") {
    return (
      <GoalsProvider>
        <Goals />
      </GoalsProvider>
    );
  }

  if (window.location.pathname === "/") {
    return (
      <HabitsProvider>
        <Dashboard />
      </HabitsProvider>
    );
  }

  return <NotFound />;
}
