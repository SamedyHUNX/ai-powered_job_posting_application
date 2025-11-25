import PrivateRoute from "@/routes/PrivateRoute";

export default function OrganizationPage() {
  return (
    <PrivateRoute>
      <div>All Organization</div>
    </PrivateRoute>
  );
}
