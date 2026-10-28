"use client";

import HealthTab from "../components/HealthTab";
import { useParentContext } from "../ParentContext";

export default function HealthPage() {
  const { child } = useParentContext();
  return <HealthTab child={child} />;
}
