"use client";

import AttendanceTab from "../components/AttendanceTab";
import { useParentContext } from "../ParentContext";

export default function AttendancePage() {
  const { child } = useParentContext();
  return <AttendanceTab child={child} />;
}
