import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Premium Plan",
    amount: "$99.00",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Basic Plan",
    amount: "$29.00",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    product: "Enterprise Plan",
    amount: "$299.00",
    status: "processing",
    date: "2024-01-13",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    product: "Premium Plan",
    amount: "$99.00",
    status: "completed",
    date: "2024-01-12",
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    product: "Basic Plan",
    amount: "$29.00",
    status: "cancelled",
    date: "2024-01-11",
  },
]

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          You have 265 orders this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {order.customer}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.product}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{order.amount}</span>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
