const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  try {
    // Create categories
    await db.category.createMany({
      data: [
        { name: "Jeans" },
        { name: "Glasses" },
        { name: "T-Shirts" },
        { name: "Shoes" },
      ],
    });
    console.log("Success seeding categories.");

    // Fetch created categories
    const categories = await db.category.findMany({
      where: {
        name: { in: ["Jeans", "Glasses", "T-Shirts", "Shoes"] },
      },
    });

    // Define attribute options
    const sizes = ["S", "M", "L", "XL"];
    const colors = ["Red", "Blue", "Black", "White", "Gray"];
    const materialsJeans = ["Denim", "Cotton", "Polyester"];
    const materialsShoes = ["Leather", "Canvas", "Suede"];
    const frameMaterials = ["Metal", "Plastic", "Wood"];

    // Define attributes for each category and create attributes in the database
    const attributesMap = {};
    for (const category of categories) {
      const attributesData = [];
      if (category.name === "Jeans") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true },
          { name: "Color", categoryId: category.id, required: true },
          { name: "Material", categoryId: category.id, required: false }
        );
      } else if (category.name === "Glasses") {
        attributesData.push(
          { name: "Frame Material", categoryId: category.id, required: true },
          { name: "Color", categoryId: category.id, required: false }
        );
      } else if (category.name === "T-Shirts") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true },
          { name: "Color", categoryId: category.id, required: true },
          { name: "Fabric", categoryId: category.id, required: false }
        );
      } else if (category.name === "Shoes") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true },
          { name: "Color", categoryId: category.id, required: true },
          { name: "Material", categoryId: category.id, required: false }
        );
      }

      await db.attribute.createMany({ data: attributesData });
      console.log(`Success seeding attributes for ${category.name}.`);

      // Fetch and store attribute IDs for future reference
      const savedAttributes = await db.attribute.findMany({
        where: { categoryId: category.id },
      });
      attributesMap[category.id] = savedAttributes;
    }

    // Helper function to generate random products
    const generateRandomProducts = (categoryId, numProducts, models) => {
      const brands = ["Brand X", "Brand Y", "Brand Z", "Brand Q"];
      const products = [];
      for (let i = 0; i < numProducts; i++) {
        const model = models[Math.floor(Math.random() * models.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const price = parseFloat((Math.random() * 100 + 20).toFixed(2)); // Random price between 20 and 120

        products.push({
          model: `${model} ${i + 1}`,
          brand,
          price,
          categoryId,
        });
      }
      return products;
    };

    // Models for each category
    const categoryModels = {
      "Jeans": ["Skinny", "Bootcut", "Straight", "Relaxed"],
      "Glasses": ["Aviator", "Wayfarer", "Round", "Square"],
      "T-Shirts": ["V-Neck", "Crew Neck", "Polo", "Tank Top"],
      "Shoes": ["Sneakers", "Boots", "Loafers", "Sandals"],
    };

    // Seed products for each category
    for (const category of categories) {
      const productsData = generateRandomProducts(category.id, 15, categoryModels[category.name]);
      await db.product.createMany({ data: productsData });
      console.log(`Success seeding products for ${category.name}.`);

      // Fetch saved products to add attributes and images
      const products = await db.product.findMany({
        where: { categoryId: category.id },
      });

      // Seed attribute values and images for each product
      for (const product of products) {
        const attributeValues = [];
        for (const attribute of attributesMap[category.id]) {
          if (attribute.name === "Size") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: sizes[Math.floor(Math.random() * sizes.length)],
            });
          } else if (attribute.name === "Color") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: colors[Math.floor(Math.random() * colors.length)],
            });
          } else if (attribute.name === "Material" && category.name === "Jeans") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: materialsJeans[Math.floor(Math.random() * materialsJeans.length)],
            });
          } else if (attribute.name === "Material" && category.name === "Shoes") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: materialsShoes[Math.floor(Math.random() * materialsShoes.length)],
            });
          } else if (attribute.name === "Frame Material" && category.name === "Glasses") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: frameMaterials[Math.floor(Math.random() * frameMaterials.length)],
            });
          }
        }

        await db.productAttributeValue.createMany({ data: attributeValues });
        console.log(`Success seeding attributes for product ${product.model}.`);

        if (Math.random() > 0.3) { // 70% chance to add images
          await db.productImage.createMany({
            data: [
              { productId: product.id, url: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}` },
              { productId: product.id, url: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}` },
            ],
          });
          console.log(`Success seeding images for product ${product.model}.`);
        }
      }
    }

  } catch (error) {
    console.log("Error seeding data:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
