"use client";

import AssessmentTab from "../components/AssessmentTab";
import { useParentContext } from "../ParentContext";

export default function AssessmentPage() {
  const { child } = useParentContext();
  return <AssessmentTab child={child} />;
}
