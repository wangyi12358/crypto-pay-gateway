import { nanoid } from 'nanoid';

export function generateTradeId(): string {
	const date = new Date()
		.toISOString()
		.replace(/[-T:.Z]/g, '')
		.slice(0, 14);
	const random = nanoid(6);
	return `${date}${random}`;
}
