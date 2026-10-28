"use client";

import DashboardTab from "./components/DashboardTab";
import { useParentContext } from "./ParentContext";

export default function ParentDashboardPage() {
  const { childrenData, parent, navigateTab } = useParentContext();
  return (
    <DashboardTab
      childrenData={childrenData}
      parent={parent}
      onNavigateTab={navigateTab}
    />
  );
}
