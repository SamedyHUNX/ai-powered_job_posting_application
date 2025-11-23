import PrivateRoute from "@/routes/PrivateRoute";

export default function HomePage() {
  return (
    <PrivateRoute>
      <h1>Hi</h1>;
    </PrivateRoute>
  );
}
