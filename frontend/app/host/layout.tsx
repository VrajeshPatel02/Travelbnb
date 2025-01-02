import HostLayout from "../../components/HostLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <HostLayout>
      {children}
    </HostLayout>
  );
}
