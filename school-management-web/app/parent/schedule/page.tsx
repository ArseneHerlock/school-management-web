"use client";

import ScheduleTab from "../components/ScheduleTab";
import { useParentContext } from "../ParentContext";

export default function SchedulePage() {
  const { child } = useParentContext();
  return <ScheduleTab child={child} />;
}
