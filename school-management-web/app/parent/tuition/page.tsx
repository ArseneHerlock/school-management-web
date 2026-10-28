"use client";

import TuitionTab from "../components/TuitionTab";
import { useParentContext } from "../ParentContext";

export default function TuitionPage() {
  const { child, fees, parentId } = useParentContext();
  return (
    <TuitionTab
      child={child}
      items={fees}
      history={[]}
      parentId={parentId}
    />
  );
}
