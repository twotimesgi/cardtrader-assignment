const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
  try {
    // Create two categories
    await db.category.createMany({
      data: [
        { name: "Casual Wear" },
        { name: "Formal Wear" },
      ],
    });

    console.log("Success seeding categories.");

    // Fetch categories
    const categories = await db.category.findMany({
      where: {
        name: { in: ["Casual Wear", "Formal Wear"] },
      },
    });

    // Define attribute options
    const sizes = ["S", "M", "L", "XL"];
    const colors = ["Red", "Blue", "Green", "Black", "White"];
    const fabrics = ["Cotton", "Polyester", "Denim", "Wool"];
    const materials = ["Silk", "Linen", "Leather", "Velvet"];

    // Define attributes for the two categories and create attributes in the database
    const attributesMap = {};
    for (const category of categories) {
      const attributesData = [];
      if (category.name === "Casual Wear") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true },
          { name: "Color", categoryId: category.id, required: true },
          { name: "Fabric", categoryId: category.id, required: false }
        );
      } else if (category.name === "Formal Wear") {
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
    const generateRandomProducts = (categoryId, numProducts, categoryName) => {
      const models = categoryName === "Casual Wear"
        ? ["Hoodie", "T-Shirt", "Jeans", "Sneakers", "Baseball Cap"]
        : ["Blazer", "Dress Shirt", "Slacks", "Oxfords", "Tie"];
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

    // Seed 25 products for each category, along with their attributes
    for (const category of categories) {
      const productsData = generateRandomProducts(category.id, 25, category.name);
      await db.product.createMany({ data: productsData });
      console.log(`Success seeding 25 products for ${category.name}.`);

      // Fetch the saved products
      const products = await db.product.findMany({
        where: { categoryId: category.id },
      });

      // Seed attribute values for each product
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
          } else if (attribute.name === "Fabric" && category.name === "Casual Wear") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: fabrics[Math.floor(Math.random() * fabrics.length)],
            });
          } else if (attribute.name === "Material" && category.name === "Formal Wear") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: materials[Math.floor(Math.random() * materials.length)],
            });
          }
        }
        await db.productAttributeValue.createMany({ data: attributeValues });
        console.log(`Success seeding attributes for product ${product.model}.`);
      }
    }

  } catch (error) {
    console.log("Error seeding data:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
