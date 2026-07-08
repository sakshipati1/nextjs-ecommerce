import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast"; // Imported the global toast container
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NexCart - Modern Society Marketplace",
  description: "Shop community favorites from your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {/* Global listener for toast popups */}
        <Toaster position="top-center" reverseOrder={false} />

        <Navbar />
        {children}
      </body>
    </html>
  );
}
