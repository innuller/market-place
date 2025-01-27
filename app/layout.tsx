import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Header } from "@/components/header2";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Market Place",
  description: "Find Suppliers and Buyers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-[#003853] text-foreground">
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* <main className="min-h-screen flex flex-col items-center"> */}
          <>
            {/* <div className="flex flex-col gap-20 max-w-5xl p-5"> */}
            <Header />
            {children}
            {/* </div> */}
          </>
          {/* </main> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
