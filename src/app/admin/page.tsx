import { Card, CardBody } from "@heroui/card"

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-default-500">今日订单</p>
            <p className="text-2xl font-bold">0</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-default-500">今日收入</p>
            <p className="text-2xl font-bold">0 USDT</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-default-500">待支付</p>
            <p className="text-2xl font-bold">0</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-default-500">总订单</p>
            <p className="text-2xl font-bold">0</p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
