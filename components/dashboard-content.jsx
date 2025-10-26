import { DashboardStats } from "./dashboard-stats"
import { RecentOrders } from "./recent-orders"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Your business performance over the last 30 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart placeholder - Add your chart library here
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-3">
          <RecentOrders />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                <span>Add New Product</span>
                <span className="text-muted-foreground">→</span>
              </button>
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                <span>View Reports</span>
                <span className="text-muted-foreground">→</span>
              </button>
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                <span>Manage Users</span>
                <span className="text-muted-foreground">→</span>
              </button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment processed</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">User registration</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
