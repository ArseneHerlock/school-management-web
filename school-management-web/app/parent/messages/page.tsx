"use client";

import MessagesTab from "../components/MessagesTab";
import { useParentContext } from "../ParentContext";

export default function MessagesPage() {
  const { child, childrenData, openCallModal } = useParentContext();
  return (
    <MessagesTab
      child={child}
      childrenData={childrenData}
      onOpenCall={openCallModal}
    />
  );
}
