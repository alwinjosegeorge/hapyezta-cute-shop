import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/control_panel")({
  beforeLoad: () => {
    throw redirect({ to: "/control-panel" });
  },
});
