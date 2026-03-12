require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const categories = [
  {
    name: "Mobiles",
    slug: "mobiles",
    icon: "📱",
    order: 1,
    subcategories: [
      { name: "Mobile Phones", slug: "mobile-phones" },
      { name: "Accessories", slug: "mobile-accessories" },
      { name: "Tablets", slug: "tablets" },
      { name: "Smart Watches", slug: "smart-watches" },
    ],
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    icon: "🚗",
    order: 2,
    subcategories: [
      { name: "Cars", slug: "cars" },
      { name: "Cars on Installments", slug: "cars-installments" },
      { name: "Motorcycles", slug: "motorcycles" },
      { name: "Buses & Vans", slug: "buses-vans" },
      { name: "Rickshaw & Chingchi", slug: "rickshaw" },
      { name: "Spare Parts", slug: "spare-parts" },
    ],
  },
  {
    name: "Property for Sale",
    slug: "property-sale",
    icon: "🏠",
    order: 3,
    subcategories: [
      { name: "Houses", slug: "houses-sale" },
      { name: "Apartments & Flats", slug: "apartments-sale" },
      { name: "Portions & Floors", slug: "portions-sale" },
      { name: "Shops & Offices", slug: "shops-sale" },
      { name: "Plots & Land", slug: "plots-sale" },
    ],
  },
  {
    name: "Property for Rent",
    slug: "property-rent",
    icon: "🏢",
    order: 4,
    subcategories: [
      { name: "Houses", slug: "houses-rent" },
      { name: "Apartments & Flats", slug: "apartments-rent" },
      { name: "Portions & Floors", slug: "portions-rent" },
      { name: "Shops & Offices", slug: "shops-rent" },
      { name: "Rooms", slug: "rooms-rent" },
    ],
  },
  {
    name: "Electronics & Home Appliances",
    slug: "electronics",
    icon: "💻",
    order: 5,
    subcategories: [
      { name: "Computers & Laptops", slug: "computers" },
      { name: "TVs & Videos", slug: "tvs" },
      { name: "Games & Consoles", slug: "games" },
      { name: "Cameras", slug: "cameras" },
      { name: "ACs & Coolers", slug: "acs" },
      { name: "Fridges & Freezers", slug: "fridges" },
      { name: "Washing Machines", slug: "washing-machines" },
      { name: "Kitchen Appliances", slug: "kitchen-appliances" },
    ],
  },
  {
    name: "Bikes",
    slug: "bikes",
    icon: "🏍️",
    order: 6,
    subcategories: [
      { name: "Motorcycles", slug: "motorcycles-bikes" },
      { name: "Spare Parts", slug: "bike-spare-parts" },
      { name: "Bicycles", slug: "bicycles" },
      { name: "Scooters", slug: "scooters" },
    ],
  },
  {
    name: "Business, Industrial & Agriculture",
    slug: "business",
    icon: "🏭",
    order: 7,
    subcategories: [
      { name: "Business for Sale", slug: "business-sale" },
      { name: "Food & Restaurants", slug: "food-restaurants" },
      { name: "Construction & Materials", slug: "construction" },
      { name: "Agriculture", slug: "agriculture" },
      { name: "Medical & Pharma", slug: "medical" },
      { name: "Trade & Industrial", slug: "industrial" },
    ],
  },
  {
    name: "Services",
    slug: "services",
    icon: "🔧",
    order: 8,
    subcategories: [
      { name: "Education & Classes", slug: "education" },
      { name: "Car Rental", slug: "car-rental" },
      { name: "Drivers & Taxi", slug: "drivers" },
      { name: "Health & Beauty", slug: "health" },
      { name: "Home & Office Repair", slug: "repair" },
      { name: "Movers & Packers", slug: "movers" },
      { name: "Web Development", slug: "web-dev" },
    ],
  },
  {
    name: "Jobs",
    slug: "jobs",
    icon: "💼",
    order: 9,
    subcategories: [
      { name: "Accounting & Finance", slug: "accounting" },
      { name: "IT & Networking", slug: "it" },
      { name: "Marketing", slug: "marketing" },
      { name: "Part Time", slug: "part-time" },
      { name: "Online", slug: "online-jobs" },
    ],
  },
  {
    name: "Animals",
    slug: "animals",
    icon: "🐾",
    order: 10,
    subcategories: [
      { name: "Pets", slug: "pets" },
      { name: "Farm Animals", slug: "farm-animals" },
      { name: "Aquarium & Fish", slug: "aquarium" },
      { name: "Birds", slug: "birds" },
      { name: "Pet Food & Accessories", slug: "pet-food" },
    ],
  },
  {
    name: "Furniture & Home Decor",
    slug: "furniture",
    icon: "🛋️",
    order: 11,
    subcategories: [
      { name: "Sofa & Chairs", slug: "sofa" },
      { name: "Beds & Wardrobes", slug: "beds" },
      { name: "Tables & Dining", slug: "tables" },
      { name: "Home Decoration", slug: "home-decor" },
      { name: "Garden", slug: "garden" },
    ],
  },
  {
    name: "Fashion & Beauty",
    slug: "fashion",
    icon: "👗",
    order: 12,
    subcategories: [
      { name: "Clothes", slug: "clothes" },
      { name: "Shoes", slug: "shoes" },
      { name: "Watches", slug: "watches" },
      { name: "Jewellery", slug: "jewellery" },
      { name: "Makeup", slug: "makeup" },
      { name: "Bags", slug: "bags" },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    icon: "👶",
    order: 13,
    subcategories: [
      { name: "Kids Furniture", slug: "kids-furniture" },
      { name: "Toys", slug: "toys" },
      { name: "Kids Clothing", slug: "kids-clothing" },
      { name: "Prams & Walkers", slug: "prams" },
    ],
  },
  {
    name: "Books, Sports & Hobbies",
    slug: "books-sports",
    icon: "📚",
    order: 14,
    subcategories: [
      { name: "Books & Magazines", slug: "books" },
      { name: "Sports Equipment", slug: "sports" },
      { name: "Musical Instruments", slug: "musical" },
      { name: "Gym & Fitness", slug: "gym" },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log("Categories seeded!");
  process.exit();
}

seed();
