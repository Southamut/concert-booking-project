import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminHomePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Concert cards will go here */}
        <p className="text-gray-500">Concert list will be displayed here</p>
      </div>
    </AdminLayout>
  );
}