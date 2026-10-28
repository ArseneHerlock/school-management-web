"use client";

import DashboardTab from "./components/DashboardTab";
import { useParentContext } from "./ParentContext";

export default function ParentApp({ initialTab }: { initialTab?: string }) {
  const { childrenData, parent, navigateTab } = useParentContext();
  void initialTab;
  return (
    <DashboardTab
      childrenData={childrenData}
      parent={parent}
      onNavigateTab={navigateTab}
    />
  );
}
