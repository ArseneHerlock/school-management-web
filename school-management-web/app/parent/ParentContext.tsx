"use client";

import { createContext, useContext } from "react";
import { ACTIVE_CHILD, ChildInfo, EMPTY_PARENT, MomentItem, ParentProfile } from "./types";

export interface ParentContextValue {
  parent: ParentProfile;
  parentId: string;
  childrenData: ChildInfo[];
  child: ChildInfo;
  childId: string;
  setChildId: (id: string) => void;
  news: any[];
  fees: any[];
  navigateTab: (tab: string) => void;
  openCallModal: () => void;
  selectMoment: (moment: MomentItem | null) => void;
}

export const ParentContext = createContext<ParentContextValue>({
  parent: EMPTY_PARENT,
  parentId: "",
  childrenData: [],
  child: ACTIVE_CHILD,
  childId: "",
  setChildId: () => {},
  news: [],
  fees: [],
  navigateTab: () => {},
  openCallModal: () => {},
  selectMoment: () => {},
});

export function useParentContext(): ParentContextValue {
  return useContext(ParentContext);
}
