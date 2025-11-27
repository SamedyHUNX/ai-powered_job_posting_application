type PageProps = {
  params: Promise<{ organization: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrganizationPage({ params }: PageProps) {
  const { organization } = await params;

  return <h1>Organization: {organization}</h1>;
}
