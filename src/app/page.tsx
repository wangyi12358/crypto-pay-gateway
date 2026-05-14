import { Button } from "@heroui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Crypto <span className="text-primary">Pay</span> Gateway
        </h1>
        <p className="text-xl text-default-500">
          开源多链加密货币支付网关
        </p>
        <div className="flex gap-4">
          <Button
            as={Link}
            href="/admin"
            color="primary"
            size="lg"
          >
            管理后台
          </Button>
          <Button
            as={Link}
            href="/api/payments/v1/config"
            variant="bordered"
            size="lg"
          >
            API 文档
          </Button>
        </div>
      </div>
    </div>
  )
}
