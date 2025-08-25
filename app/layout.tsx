import QueryProvider from "@/components/provider/query-provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProvider>{children}</QueryProvider>;
}
