import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "NexCart - Neighborhood Marketplace",
  description: "Hyperlocal fulfillment platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster position="top-center" />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
