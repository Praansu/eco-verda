import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Bamboo", slug: "bamboo" } }),
    prisma.category.create({ data: { name: "Cotton", slug: "cotton" } }),
    prisma.category.create({ data: { name: "Hay", slug: "hay" } }),
    prisma.category.create({ data: { name: "Metal", slug: "metal" } }),
    prisma.category.create({ data: { name: "Other", slug: "other" } }),
  ]);

  const [bamboo, cotton, hay, metal, other] = categories;

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@ecoverda.com",
      hashedPassword,
    },
  });

  // Products
  interface ProductSeed {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stock: number;
    featured?: boolean;
    images: string;
  }

  const products: ProductSeed[] = [
    { name: "Bamboo Fiber Straw", description: "Straws made with bamboo fiber. Reusable and lightweight. 20 in one box.", price: 780, categoryId: other.id, stock: 100, featured: true, images: JSON.stringify(["/images/Fiber.png"]) },
    { name: "Organic Comb", description: "Organic comb made with animal horns. No animals were harmed — naturally deceased. Limited edition.", price: 1049, categoryId: other.id, stock: 25, images: JSON.stringify(["/images/comb.png"]) },
    { name: "EcoVerda Ceramic Mug", description: "Ceramic mug made from clay and minerals — 100% natural and non-toxic.", price: 280, categoryId: other.id, stock: 80, featured: true, images: JSON.stringify(["/images/MUG.png"]) },
    { name: "Bamboo Straw", description: "Light bamboo straw handmade with real bamboo. Reusable and durable. Pack of 6.", price: 285, categoryId: bamboo.id, stock: 150, images: JSON.stringify(["/images/Straw.jpg"]) },
    { name: "Bamboo Toothbrush Set", description: "Eco-friendly toothbrush made with bamboo. Comes in a set of 2.", price: 220, categoryId: bamboo.id, stock: 200, featured: true, images: JSON.stringify(["/images/toothbrush.jpg"]) },
    { name: "Bamboo Steamer", description: "Bamboo steamer to cook and reheat your foods. Handmade with 100% bamboo.", price: 7700, categoryId: bamboo.id, stock: 15, images: JSON.stringify(["/images/Steamer.jpg"]) },
    { name: "Organic Cotton Tote Bag", description: "Lightweight brown cotton tote bag made with 100% cotton.", price: 500, categoryId: cotton.id, stock: 60, images: JSON.stringify(["/images/cottonbag.jpg"]) },
    { name: "Organic Cotton Sack", description: "Cotton sack bag to store your ingredients. Available in 3 sizes. 2 sacks per order.", price: 820, categoryId: cotton.id, stock: 40, images: JSON.stringify(["/images/Sack.jpg"]) },
    { name: "Cotton Apron", description: "Cotton apron available in 5 colors. 100% cotton. Washable and lightweight.", price: 755, categoryId: cotton.id, stock: 35, images: JSON.stringify(["/images/Apron.jpg"]) },
    { name: "Handwoven Straw Basket", description: "Handwoven basket made with 100% natural straw. Zero plastic.", price: 2400, categoryId: hay.id, stock: 20, images: JSON.stringify(["/images/basket.jpg"]) },
    { name: "Straw Bag", description: "Affordable straw bag made with natural straw. Perfect for any outdoor hang.", price: 1900, categoryId: hay.id, stock: 30, images: JSON.stringify(["/images/hay-bag.jpg"]) },
    { name: "Straw Hat", description: "Summer hat made of straw. Perfect sun protection, eco-friendly style.", price: 349, categoryId: hay.id, stock: 45, images: JSON.stringify(["/images/hat.jpg"]) },
    { name: "Reusable Steel Straws", description: "Reusable metal straw that is durable and eco-friendly. 5 straws in one pack.", price: 780, categoryId: metal.id, stock: 90, featured: true, images: JSON.stringify(["/images/SteelStraw.jpg"]) },
    { name: "Natural Scrubber", description: "Our signature natural scrubber. Perfect for long-lasting use without microplastics.", price: 330, categoryId: other.id, stock: 75, featured: true, images: JSON.stringify(["/images/brush.jpg"]) },
    { name: "Organic Soap", description: "Enriched with essential oils, our soaps are gentle on your skin and the earth.", price: 220, categoryId: other.id, stock: 100, images: JSON.stringify(["/images/soap.jpg"]) },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Created ${products.length} products`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
