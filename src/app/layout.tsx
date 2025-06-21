import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshVeggies - Bulk Vegetable Supply",
  description: "Premium bulk vegetable supply for hostels, PGs, restaurants, and tiffin services",
  keywords: "bulk vegetables, wholesale vegetables, restaurant supplies, hostel food supplies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-black`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <footer className="bg-gray-900 dark:bg-gray-800 text-white py-8 mt-auto">
                  <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2024 FreshVeggies. All rights reserved.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Premium bulk vegetable supply for commercial kitchens
                    </p>
                  </div>
                </footer>
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
