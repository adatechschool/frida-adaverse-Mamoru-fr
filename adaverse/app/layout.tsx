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
import {SessionProvider} from "@/context/SessionContext";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";

export const metadata: Metadata = {
  title: "AdaVerse",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({headers: await headers()});
  
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
                      <SessionProvider session={session}>
                      <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-neutral-900 dark:text-white transition-colors" >
                        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 transition-colors">
                          <NavbarContent />
                        </nav>
                        <div className="pt-20">
                          {children}
                        </div>
                        <AddProjectModal />
                      </div>
                      </SessionProvider>
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
