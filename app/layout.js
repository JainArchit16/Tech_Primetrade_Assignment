import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Trading Intel" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black relative`}>
        <div className="fixed inset-0 bg-grid-white pointer-events-none z-0" />
        <div className="relative z-10">
          <Toaster position="bottom-right" />
          {children}
        </div>
      </body>
    </html>
  );
}
