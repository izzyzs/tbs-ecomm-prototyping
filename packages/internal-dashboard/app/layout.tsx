import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TBS Internal Dashboard",
    description: "Operations dashboard for inventory management and order fulfillment.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                    <SidebarInset className="bg-transparent">
                        <div className="sticky top-0 z-30 border-b border-white/60 bg-background/80 backdrop-blur-xl">
                            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center gap-3">
                                    <SidebarTrigger className="size-9 rounded-xl border border-white/70 bg-white/70 text-foreground shadow-sm backdrop-blur hover:bg-white" />
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">TBS Operations</p>
                                        <p className="text-sm font-medium text-foreground">Internal Dashboard</p>
                                    </div>
                                </div>
                                <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs text-muted-foreground shadow-sm md:flex">
                                    <span className="inline-flex size-2 rounded-full bg-emerald-500" />
                                    Live inventory and order activity
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                            {children}
                        </div>
                        <Toaster closeButton={true} position="top-right" richColors={true} />
                    </SidebarInset>
                </SidebarProvider>
            </body>
        </html>
    );
}

