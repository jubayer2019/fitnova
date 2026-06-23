import "./globals.css";
import Providers from "../components/Providers.jsx";

export const metadata = {
  title: "FitNova — The Premium Fitness Operating System",
  description: "FitNova unifies class booking, trainer operations, and member engagement into one beautifully designed platform.",
  authors: [{ name: "FitNova Systems Inc." }],
  openGraph: {
    title: "FitNova — The Premium Fitness Operating System",
    description: "Class booking, trainer ops, and analytics for modern studios.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
