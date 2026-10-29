import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="public-theme"
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
