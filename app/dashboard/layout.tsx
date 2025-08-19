import Navbar from "@/components/header/navbar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Sidebar from "@/components/header/sidebar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/header/AppSidebar"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="mx-auto">

      </div>
      <div className="relative">

        <SidebarProvider>
          <AppSidebar />

          <div className="flex flex-col w-full">
            <Navbar />
            {children}
          </div>
        </SidebarProvider>
      </div>


    </>
  )
}