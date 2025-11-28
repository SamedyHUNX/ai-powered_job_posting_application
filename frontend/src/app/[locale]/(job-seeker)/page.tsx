import PrivateRoute from "@/routes/PrivateRoute";

export default function JobSeekerPage() {
  return (
    <PrivateRoute>
      <h1>Job Seeker Homepage</h1>
    </PrivateRoute>
  );
}
