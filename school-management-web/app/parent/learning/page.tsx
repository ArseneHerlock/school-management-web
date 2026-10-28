"use client";

import LearningTab from "../components/LearningTab";
import { useParentContext } from "../ParentContext";

export default function LearningPage() {
  const { child } = useParentContext();
  return <LearningTab child={child} />;
}
