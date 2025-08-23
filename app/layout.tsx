import type React from "react";
import "./styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {Providers} from "@/app/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
