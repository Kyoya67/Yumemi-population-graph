import './globals.css'  // またはあなたのCSSファイルのパス

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
