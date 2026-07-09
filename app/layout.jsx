export const metadata = {
  title: 'Criks Catalog',
  description: 'Slides & tees from Criks',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
