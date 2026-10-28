'use client'

import { useEffect, useState } from 'react'
import { loadLiveTeacherChildren } from '../data'

export default function TeacherLiveData({ children }: { children: React.ReactNode }) {
  const [, setVersion] = useState(0)
  useEffect(() => {
    loadLiveTeacherChildren().finally(() => setVersion(v => v + 1))
  }, [])
  return <>{children}</>
}
