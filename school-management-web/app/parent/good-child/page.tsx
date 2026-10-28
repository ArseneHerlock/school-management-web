"use client";

import GoodChildTab from "../components/GoodChildTab";
import { useParentContext } from "../ParentContext";

export default function GoodChildPage() {
  const { child } = useParentContext();
  return <GoodChildTab child={child} />;
}
