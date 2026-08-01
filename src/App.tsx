import { HabitsProvider } from "./context/HabitsContext";
import { GoalsProvider } from "./context/GoalsContext";
import { usePathname } from "./navigation";
import { Dashboard } from "./pages/Dashboard";
import { Goals } from "./pages/Goals";
import { Methodology } from "./pages/Methodology";
import { NotFound } from "./pages/NotFound";

export default function App() {
  const pathname = usePathname();

  if (pathname === "/metodologia") {
    return <Methodology />;
  }

  if (pathname === "/metas") {
    return (
      <GoalsProvider>
        <Goals />
      </GoalsProvider>
    );
  }

  if (pathname === "/") {
    return (
      <HabitsProvider>
        <Dashboard />
      </HabitsProvider>
    );
  }

  return <NotFound />;
}
