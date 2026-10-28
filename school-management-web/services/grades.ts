import { api, normalizeList } from "./client";

export interface GradeLevel {
  id: string;
  maKhoi: string;
  tenKhoi: string;
  ghiChu?: string;
}

export interface CreateGradeInput {
  maKhoi: string;
  tenKhoi: string;
  ghiChu?: string;
}

export async function getGrades(): Promise<GradeLevel[]> {
  const res = await api.get<any>("grades", "/api/grades");
  return normalizeList<GradeLevel>(res);
}

export async function getGradeById(id: string): Promise<GradeLevel> {
  return await api.get<GradeLevel>("grades", `/api/grades/${id}`);
}

export async function createGrade(data: CreateGradeInput): Promise<GradeLevel> {
  return await api.post<GradeLevel>("grades", "/api/grades", data);
}

export async function updateGrade(id: string, data: Partial<CreateGradeInput> & { [key: string]: any }): Promise<GradeLevel> {
  return await api.put<GradeLevel>("grades", `/api/grades/${id}`, data);
}

export async function deleteGrade(id: string): Promise<void> {
  await api.delete("grades", `/api/grades/${id}`);
}
