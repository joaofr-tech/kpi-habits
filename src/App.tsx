import { HabitsProvider } from "./context/HabitsContext";
import { Dashboard } from "./pages/Dashboard";
import { CardLab } from "./pages/CardLab";
import { Methodology } from "./pages/Methodology";

export default function App() {
  if (window.location.pathname === "/laboratorio/cards") {
    return <CardLab />;
  }

  const page =
    window.location.pathname === "/metodologia" ? (
      <Methodology />
    ) : (
      <Dashboard />
    );

  return (
    <HabitsProvider>{page}</HabitsProvider>
  );
}
