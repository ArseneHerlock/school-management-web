import TeacherSidebar from './components/TeacherSidebar';
import TeacherTopBar  from './components/TeacherTopBar';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fff8f3]">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TeacherTopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
