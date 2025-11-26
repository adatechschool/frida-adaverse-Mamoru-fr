import type {Metadata} from "next";
import "./globals.css";
import {AdaPromotionsProvider} from "@/context/AdaPromotionsContext";
import {AdaProjectsProvider} from "@/context/AdaProjectsContext";
import TitleButton from "@/components/TitleButton";
import {StudentsProvider} from "@/context/StudentsContext";

export const metadata: Metadata = {
  title: "AdaVerse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AdaPromotionsProvider>
          <AdaProjectsProvider>
            <StudentsProvider>
              <div className="min-h-screen bg-neutral-950 font-sans text-white" >
                <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
                  <div className="flex items-center justify-between px-8 py-4">
                    <TitleButton />
                  </div>
                </nav>
                <div className="pt-20">
                  {children}
                </div>
              </div>
            </StudentsProvider>
          </AdaProjectsProvider>
        </AdaPromotionsProvider>
      </body>
    </html>
  );
}
