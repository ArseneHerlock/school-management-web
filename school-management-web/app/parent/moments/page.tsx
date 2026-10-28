"use client";

import MomentsTab from "../components/MomentsTab";
import { useParentContext } from "../ParentContext";

export default function MomentsPage() {
  const { child, selectMoment } = useParentContext();
  return (
    <MomentsTab
      child={child}
      moments={[]}
      onSelectMoment={selectMoment}
      onToggleLike={() => {}}
    />
  );
}
