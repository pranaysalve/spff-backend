import { DashboardLayout } from "../../components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics for your business.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Views</CardTitle>
              <CardDescription>Total page views this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Unique Visitors</CardTitle>
              <CardDescription>New visitors this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,234</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bounce Rate</CardTitle>
              <CardDescription>Average bounce rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.4%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Duration</CardTitle>
              <CardDescription>Average session time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3m 42s</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Your website traffic over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Analytics chart placeholder - Add your chart library here
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
