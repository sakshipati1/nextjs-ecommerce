import connectDB from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import Product from "@/models/product";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to fetch the vector coordinates from Gemini safely
async function generatevector(text) {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: text,
    });

    // Safely grab the vector array using fallback checks for the new SDK
    const values =
      response?.embedding?.values || response?.embeddings?.[0]?.values;
    return values;
  } catch (error) {
    console.error(
      `❌ Gemini API failed for text: "${text.substring(0, 25)}..."`,
      error,
    );
    return null;
  }
}

export async function GET() {
  await connectDB();

  console.log("🧹 Clearing existing items from the database...");
  // Clear existing items
  await Product.deleteMany();

  // Your original mock dataset
  const rawProducts = [
    {
      title: "Blue Sneakers",
      description: "Comfortable and stylish sneakers for everyday wear.",
      price: 79.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Red T-shirt",
      description: "A classic red t-shirt made from soft cotton.",
      price: 19.99,
      category: "Apparel",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Black Jeans",
      description: "Slim-fit black jeans for a sleek and modern look.",
      price: 49.99,
      category: "Apparel",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "White Hoodie",
      description: "Warm fleece hoodie with adjustable drawstring.",
      price: 59.99,
      category: "Apparel",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Running Shoes",
      description: "Lightweight running shoes with breathable mesh.",
      price: 89.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Leather Wallet",
      description: "Premium leather wallet with multiple card slots.",
      price: 34.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Digital Watch",
      description: "Water-resistant digital watch with LED display.",
      price: 69.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Wireless Earbuds",
      description: "Crystal-clear sound with long battery life.",
      price: 99.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Bluetooth Speaker",
      description: "Portable speaker with rich bass and clear sound.",
      price: 79.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Gaming Mouse",
      description: "Ergonomic gaming mouse with RGB lighting.",
      price: 45.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Mechanical Keyboard",
      description: "RGB mechanical keyboard with tactile switches.",
      price: 109.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Laptop Backpack",
      description: "Durable backpack with padded laptop compartment.",
      price: 54.99,
      category: "Bags",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Travel Duffel Bag",
      description: "Spacious duffel bag for weekend trips.",
      price: 64.99,
      category: "Bags",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Sports Cap",
      description: "Adjustable cap for sports and casual outings.",
      price: 18.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Polarized Sunglasses",
      description: "UV-protected stylish sunglasses.",
      price: 39.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Formal Shirt",
      description: "Premium cotton shirt suitable for office wear.",
      price: 42.99,
      category: "Apparel",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Casual Shorts",
      description: "Comfortable cotton shorts for daily wear.",
      price: 24.99,
      category: "Apparel",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Yoga Mat",
      description: "Non-slip yoga mat for workouts and meditation.",
      price: 29.99,
      category: "Fitness",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Dumbbell Set",
      description: "Adjustable dumbbells for strength training.",
      price: 129.99,
      category: "Fitness",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Water Bottle",
      description: "Insulated stainless steel water bottle.",
      price: 22.99,
      category: "Fitness",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Coffee Mug",
      description: "Ceramic mug perfect for coffee and tea.",
      price: 14.99,
      category: "Home",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Table Lamp",
      description: "Modern LED table lamp with adjustable brightness.",
      price: 37.99,
      category: "Home",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Office Chair",
      description: "Ergonomic office chair with lumbar support.",
      price: 199.99,
      category: "Furniture",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Wooden Desk",
      description: "Minimalist wooden desk for home office.",
      price: 249.99,
      category: "Furniture",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Smartphone Stand",
      description: "Foldable stand compatible with all smartphones.",
      price: 12.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "USB-C Hub",
      description: "Multiport USB-C hub with HDMI and USB ports.",
      price: 49.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Portable SSD",
      description: "Fast external SSD with 1TB storage capacity.",
      price: 159.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Wireless Charger",
      description: "Fast wireless charging pad for smartphones.",
      price: 34.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Bean Bag",
      description: "Soft and comfortable bean bag for relaxing.",
      price: 89.99,
      category: "Furniture",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Wall Clock",
      description: "Modern silent wall clock for home decor.",
      price: 27.99,
      category: "Home",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Bed Pillow",
      description: "Memory foam pillow for comfortable sleep.",
      price: 35.99,
      category: "Home",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Cookware Set",
      description: "Non-stick cookware set for everyday cooking.",
      price: 119.99,
      category: "Kitchen",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Electric Kettle",
      description: "Fast boiling electric kettle with auto shut-off.",
      price: 44.99,
      category: "Kitchen",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Air Fryer",
      description: "Healthy cooking with little to no oil.",
      price: 149.99,
      category: "Kitchen",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Notebook Set",
      description: "Pack of premium hardcover notebooks.",
      price: 17.99,
      category: "Stationery",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Ballpoint Pen Pack",
      description: "Smooth writing pens with quick-dry ink.",
      price: 9.99,
      category: "Stationery",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Desk Organizer",
      description: "Keep your workspace neat and organized.",
      price: 21.99,
      category: "Stationery",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Canvas Sneakers",
      description: "Casual canvas sneakers with rubber sole.",
      price: 54.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Leather Boots",
      description: "Classic leather boots with durable construction.",
      price: 139.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Winter Jacket",
      description: "Insulated jacket designed for cold weather.",
      price: 179.99,
      category: "Apparel",
      image: "https://picsum.photos/500/300",
    },
  ];

  const productsWithVectors = [];

  for (const product of rawProducts) {
    console.log(`⏳ Generating embedding for: ${product.title}`);

    // CHANGES APPLIED HERE: Using multiplied string weights for Title and Category
    // This forces Atlas to prioritize item types over the secondary description words
    const textToEmbed = `PRODUCT: ${product.title}, ${product.title}. TYPE: ${product.category}, ${product.category}. INFO: ${product.description}`;

    const embedding = await generatevector(textToEmbed);

    if (embedding && embedding.length === 3072) {
      productsWithVectors.push({
        ...product,
        embedding: embedding,
      });
      console.log(`✅ Success (Length 3072): ${product.title}`);
    } else {
      console.log(
        `❌ Skipped product due to extraction failure: ${product.title}`,
      );
    }
  }

  if (productsWithVectors.length > 0) {
    await Product.insertMany(productsWithVectors);
    console.log(
      `🎉 Database seeded with ${productsWithVectors.length} vector documents successfully!`,
    );

    return Response.json({
      success: true,
      message: `Database seeded with ${productsWithVectors.length} vectors successfully using weighted gemini-embedding-2!`,
    });
  } else {
    return Response.json(
      {
        success: false,
        message:
          "No products were seeded. Check terminal console logs for failures.",
      },
      { status: 500 },
    );
  }
}
