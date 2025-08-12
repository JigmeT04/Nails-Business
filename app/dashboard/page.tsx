// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-4">This page is protected by middleware.</p>
    </div>
  );
}