import { HabitsProvider } from "./context/HabitsContext";
import { Dashboard } from "./pages/Dashboard";
import { Methodology } from "./pages/Methodology";

export default function App() {
  const page = window.location.pathname === "/metodologia"
    ? <Methodology />
    : <Dashboard />;

  return (
    <HabitsProvider>{page}</HabitsProvider>
  );
}
