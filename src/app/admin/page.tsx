import { Card, CardBody } from '@heroui/card';

export default function AdminDashboard() {
	return (
		<div>
			<h1 className='mb-6 font-bold text-2xl'>仪表盘</h1>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>今日订单</p>
						<p className='font-bold text-2xl'>0</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>今日收入</p>
						<p className='font-bold text-2xl'>0 USDT</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>待支付</p>
						<p className='font-bold text-2xl'>0</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<p className='text-default-500 text-sm'>总订单</p>
						<p className='font-bold text-2xl'>0</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
