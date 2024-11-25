const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Jeans" },
        { name: "Glasses" },
        { name: "T-Shirts" },
        { name: "Shoes" },
      ],
    });
    console.log("Success seeding categories.");

    const categories = await db.category.findMany({
      where: {
        name: { in: ["Jeans", "Glasses", "T-Shirts", "Shoes"] },
      },
    });

    const sizes = ["S", "M", "L", "XL"];
    const colors = ["Red", "Blue", "Black", "White", "Gray"];
    const materialsJeans = ["Denim", "Cotton", "Polyester"];
    const materialsShoes = ["Leather", "Canvas", "Suede"];
    const frameMaterials = ["Metal", "Plastic", "Wood"];

    const attributesMap = {};
    for (const category of categories) {
      const attributesData = [];
      if (category.name === "Jeans") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true, type: "STRING" },
          { name: "Color", categoryId: category.id, required: true, type: "STRING" },
          { name: "Material", categoryId: category.id, required: false, type: "STRING" },
          { name: "Stretchable", categoryId: category.id, required: false, type: "BOOLEAN" },
          { name: "Inseam Length", categoryId: category.id, required: false, type: "NUMBER" }
        );
      } else if (category.name === "Glasses") {
        attributesData.push(
          { name: "Frame Material", categoryId: category.id, required: true, type: "STRING" },
          { name: "Color", categoryId: category.id, required: false, type: "STRING" },
          { name: "UV Protection", categoryId: category.id, required: true, type: "BOOLEAN" },
          { name: "Lens Width", categoryId: category.id, required: false, type: "NUMBER" }
        );
      } else if (category.name === "T-Shirts") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true, type: "STRING" },
          { name: "Color", categoryId: category.id, required: true, type: "STRING" },
          { name: "Fabric", categoryId: category.id, required: false, type: "STRING" },
          { name: "Eco-Friendly", categoryId: category.id, required: false, type: "BOOLEAN" }
        );
      } else if (category.name === "Shoes") {
        attributesData.push(
          { name: "Size", categoryId: category.id, required: true, type: "STRING" },
          { name: "Color", categoryId: category.id, required: true, type: "STRING" },
          { name: "Material", categoryId: category.id, required: false, type: "STRING" },
          { name: "Waterproof", categoryId: category.id, required: false, type: "BOOLEAN" },
          { name: "Heel Height", categoryId: category.id, required: false, type: "NUMBER" }
        );
      }

      await db.attribute.createMany({ data: attributesData });
      console.log(`Success seeding attributes for ${category.name}.`);

      const savedAttributes = await db.attribute.findMany({
        where: { categoryId: category.id },
      });
      attributesMap[category.id] = savedAttributes;
    }

    const generateRandomProducts = (categoryId, numProducts, models) => {
      const brands = ["Brand X", "Brand Y", "Brand Z", "Brand Q"];
      const products = [];
      for (let i = 0; i < numProducts; i++) {
        const model = models[Math.floor(Math.random() * models.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const price = parseFloat((Math.random() * 100 + 20).toFixed(2));

        products.push({
          model: `${model} ${i + 1}`,
          brand,
          price,
          categoryId,
        });
      }
      return products;
    };

    const categoryModels = {
      "Jeans": ["Skinny", "Bootcut", "Straight", "Relaxed", "Wide Leg", "Slim Fit", "Tapered"],
      "Glasses": ["Aviator", "Wayfarer", "Round", "Square", "Cat Eye", "Rectangle"],
      "T-Shirts": ["V-Neck", "Crew Neck", "Polo", "Tank Top", "Graphic Tee", "Long Sleeve"],
      "Shoes": ["Sneakers", "Boots", "Loafers", "Sandals", "Flip Flops", "High Tops", "Running Shoes"],
    };

    for (const category of categories) {
      const productsData = generateRandomProducts(category.id, 30, categoryModels[category.name]);
      await db.product.createMany({ data: productsData });
      console.log(`Success seeding products for ${category.name}.`);

      const products = await db.product.findMany({
        where: { categoryId: category.id },
      });

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
          } else if (attribute.type === "BOOLEAN") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: Math.random() > 0.5 ? "true" : "false",
            });
          } else if (attribute.type === "NUMBER") {
            attributeValues.push({
              productId: product.id,
              attributeId: attribute.id,
              value: (Math.random() * 50).toFixed(2),
            });
          }
        }

        await db.productAttributeValue.createMany({ data: attributeValues });
        console.log(`Success seeding attributes for product ${product.model}.`);

        if (Math.random() > 0.3) {
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
