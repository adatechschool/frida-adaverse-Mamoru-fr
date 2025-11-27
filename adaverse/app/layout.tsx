import type {Metadata} from "next";
import "./globals.css";
import {AdaPromotionsProvider} from "@/context/AdaPromotionsContext";
import {AdaProjectsProvider} from "@/context/AdaProjectsContext";
import {StudentsProvider} from "@/context/StudentsContext";
import {StudentProjectsProvider} from "@/context/StudentProjectsContext";
import {ThemeProvider} from "@/context/ThemeContext";
import TitleButton from "@/components/TitleButton";
import ThemeToggle from "@/components/ThemeToggle";

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
        <ThemeProvider>
          <AdaPromotionsProvider>
            <AdaProjectsProvider>
              <StudentsProvider>
                <StudentProjectsProvider>
                  <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-white transition-colors" >
                    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
                      <div className="flex items-center justify-between px-8 py-4">
                        <TitleButton />
                        <ThemeToggle />
                      </div>
                    </nav>
                    <div className="pt-20">
                      {children}
                    </div>
                  </div>
                </StudentProjectsProvider>
              </StudentsProvider>
            </AdaProjectsProvider>
          </AdaPromotionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
