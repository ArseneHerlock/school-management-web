export function parseCriterionHeader(name: string, code: string) {
  const match = name.match(/^(\[.*?\])\s*(.*)$/);
  if (match) {
    return {
      targetCode: match[1],
      description: match[2] || name,
      fullName: name,
    };
  }

  const cleanCode = code ? `[${code}]` : '[Tiêu chí]';
  return {
    targetCode: cleanCode,
    description: name,
    fullName: name,
  };
}

export function getDomainStyle(domainName: string = '', code: string = '') {
  const c = code.toUpperCase();
  if (c.includes('TC1') || c.includes('1')) {
    return {
      domainLabel: 'Tiêu chí 1',
      pillClass: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      dotColor: '#4f46e5',
      headerBg: 'bg-indigo-50/40',
    };
  }
  if (c.includes('TC2') || c.includes('2')) {
    return {
      domainLabel: 'Tiêu chí 2',
      pillClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dotColor: '#059669',
      headerBg: 'bg-emerald-50/40',
    };
  }
  if (c.includes('TC3') || c.includes('3')) {
    return {
      domainLabel: 'Tiêu chí 3',
      pillClass: 'bg-amber-50 border-amber-200 text-amber-800',
      dotColor: '#d97706',
      headerBg: 'bg-amber-50/40',
    };
  }
  if (c.includes('TC4') || c.includes('4')) {
    return {
      domainLabel: 'Tiêu chí 4',
      pillClass: 'bg-sky-50 border-sky-200 text-sky-800',
      dotColor: '#0284c7',
      headerBg: 'bg-sky-50/40',
    };
  }
  return {
    domainLabel: 'Tiêu chí bài dạy',
    pillClass: 'bg-slate-50 border-slate-200 text-slate-800',
    dotColor: '#64748b',
    headerBg: 'bg-slate-50/40',
  };
}
