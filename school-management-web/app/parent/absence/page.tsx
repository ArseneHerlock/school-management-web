"use client";

import AbsenceTab from "../components/AbsenceTab";
import { useParentContext } from "../ParentContext";

export default function AbsencePage() {
  const { child } = useParentContext();
  return <AbsenceTab child={child} />;
}
