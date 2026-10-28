"use client";

import ProgressTab from "../components/ProgressTab";
import { useParentContext } from "../ParentContext";

export default function ProgressPage() {
  const { child } = useParentContext();
  return <ProgressTab child={child} />;
}
