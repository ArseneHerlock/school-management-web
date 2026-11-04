'use client';

import MedicationTab from '../components/MedicationTab';
import { useParentContext } from '../ParentContext';

export default function ParentMedicationPage() {
  const { child } = useParentContext();
  return <MedicationTab child={child} />;
}
