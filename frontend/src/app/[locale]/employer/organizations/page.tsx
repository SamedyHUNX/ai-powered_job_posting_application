import PrivateRoute from "@/routes/PrivateRoute";

export default function OrganizationsPage() {
  return (
    <PrivateRoute>
      <div>All Organization</div>
    </PrivateRoute>
  );
}
