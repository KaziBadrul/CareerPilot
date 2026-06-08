import "./globals.css";

export const metadata = {
  title: "CareerPilot",
  description: "Agentic Career Co-pilot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}