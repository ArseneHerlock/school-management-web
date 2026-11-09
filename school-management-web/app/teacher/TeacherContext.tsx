'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { currentUser } from '@/services/client';
import {
  loadLiveTeacherContext,
  loadLiveTeacherChildren,
  Child,
  invalidateTeacherCache,
} from './data';
import { Student } from '@/services/students';

export interface TeacherContextValue {
  teacher: any | null;
  assignedClass: any | null;
  children: Child[];
  students: Student[];
  loading: boolean;
  refreshTeacherData: (force?: boolean) => Promise<void>;
}

const defaultContextValue: TeacherContextValue = {
  teacher: null,
  assignedClass: null,
  children: [],
  students: [],
  loading: false,
  refreshTeacherData: async () => {},
};

export const TeacherContext = createContext<TeacherContextValue>(defaultContextValue);

export function useTeacherContext(): TeacherContextValue {
  return useContext(TeacherContext);
}

export function TeacherProvider({ children: providerChildren }: { children: React.ReactNode }) {
  const [teacher, setTeacher] = useState<any | null>(null);
  const [assignedClass, setAssignedClass] = useState<any | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      const [context, childList] = await Promise.all([
        loadLiveTeacherContext(forceRefresh),
        loadLiveTeacherChildren(forceRefresh),
      ]);

      if (context) {
        setTeacher(context.me);
        setAssignedClass(context.cls);
      }
      if (Array.isArray(childList)) {
        setChildrenList(childList);
      }
    } catch (error) {
      console.warn('Lỗi đồng bộ ngữ cảnh giáo viên:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Thử tải ngay lập tức từ SessionStorage/In-Memory (0ms)
    void loadData(false);
  }, [loadData]);

  const value = useMemo(
    () => ({
      teacher,
      assignedClass,
      children: childrenList,
      students,
      loading,
      refreshTeacherData: loadData,
    }),
    [teacher, assignedClass, childrenList, students, loading, loadData]
  );

  return <TeacherContext.Provider value={value}>{providerChildren}</TeacherContext.Provider>;
}
