import PrivateRoute from "@/routes/PrivateRoute";

export default function EmployerHomePage() {
  return (
    <PrivateRoute>
      <h1>Employer page</h1>;
    </PrivateRoute>
  );
}
