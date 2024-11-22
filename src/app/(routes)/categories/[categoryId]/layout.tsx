import { Header } from "@/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
    {children}
    </>
  );
}
