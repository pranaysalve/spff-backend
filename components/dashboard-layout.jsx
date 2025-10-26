import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 md:ml-64 lg:ml-52">
          <DashboardHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
