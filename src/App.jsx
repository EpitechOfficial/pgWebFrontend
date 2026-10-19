import { useState } from "react";
import AppShell from "./components/AppShell.jsx";
import LegacyRoute from "./router/LegacyRoute.jsx";

export default function App() {
  const [routeOutlet, setRouteOutlet] = useState(null);

  return (
    <>
      <AppShell onOutlet={setRouteOutlet} />
      {routeOutlet ? <LegacyRoute outlet={routeOutlet} /> : null}
    </>
  );
}
