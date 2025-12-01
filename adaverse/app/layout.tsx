import type {Metadata} from "next";
import "./globals.css";
import {AdaPromotionsProvider} from "@/context/AdaPromotionsContext";
import {AdaProjectsProvider} from "@/context/AdaProjectsContext";
import {StudentsProvider} from "@/context/StudentsContext";
import {StudentProjectsProvider} from "@/context/StudentProjectsContext";
import {ThemeProvider} from "@/context/ThemeContext";
import {AddProjectProvider} from "@/context/AddProjectContext";
import AddProjectModal from "@/components/AddProject/AddProjectModal";
import NavbarContent from "@/components/NavbarContent";
import {PromotionFilterProvider} from "@/context/PromotionFilterContext";

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
                  <AddProjectProvider>
                    <PromotionFilterProvider>
                      <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-white transition-colors" >
                        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
                          <NavbarContent />
                        </nav>
                        <div className="pt-20">
                          {children}
                        </div>
                        <AddProjectModal />
                      </div>
                    </PromotionFilterProvider>
                  </AddProjectProvider>
                </StudentProjectsProvider>
              </StudentsProvider>
            </AdaProjectsProvider>
          </AdaPromotionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
