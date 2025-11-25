import PrivateRoute from "@/routes/PrivateRoute";

export default function CreateOrganizationPage() {
  return (
    <PrivateRoute>
      <div>Create an organization</div>
    </PrivateRoute>
  );
}
