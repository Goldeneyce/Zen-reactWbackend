import { prisma } from "./src/client.js";

async function main() {
	console.log("Seeding categories...");

	// Create categories based on ProductCategory enum (excluding 'all' which is a filter)
	const categories = [
		{ name: "Power Solutions", slug: "power" },
		{ name: "Appliances", slug: "appliances" },
		{ name: "Entertainment", slug: "entertainment" },
		{ name: "Kitchen", slug: "kitchen" },
		{ name: "Security", slug: "security" },
		{ name: "Cooling", slug: "cooling" },
		{ name: "Solar", slug: "solar" },
		{ name: "Automation", slug: "automation" },
		{ name: "Lighting", slug: "lighting" },
	];

	for (const category of categories) {
		const existing = await prisma.category.findUnique({
			where: { slug: category.slug },
		});

		if (!existing) {
			await prisma.category.create({
				data: category,
			});
			console.log(`Created category: ${category.name}`);
		} else {
			console.log(`Category already exists: ${category.name}`);
		}
	}

	console.log("Seeding completed!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
