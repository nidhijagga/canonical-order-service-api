const Order = require("../models/order");

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function parsePositiveInt(value, fallback) {
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		return fallback;
	}
	return parsed;
}

exports.listOrders = async (req, res) => {
	const page = parsePositiveInt(req.query.page, 1);
	const requestedLimit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT);
	const limit = Math.min(requestedLimit, MAX_LIMIT);
	const skip = (page - 1) * limit;

	try {
		const [orders, total] = await Promise.all([
			Order.find()
				.sort({ created_at: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Order.countDocuments(),
		]);

		return res.status(200).json({
			data: orders,
			pagination: {
				page,
				limit,
				total,
				total_pages: Math.ceil(total / limit) || 1,
				has_next: page * limit < total,
			},
		});
	} catch (error) {
		console.error("Failed to fetch orders", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
