import "./globals.css";
import RouteLoader from "@/components/RouteLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <RouteLoader />
        {children}
      </body>
    </html>
  );
}
