import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PageShell({ children, withFooter = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      {withFooter && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
}
