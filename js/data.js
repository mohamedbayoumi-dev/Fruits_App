
const CITIES = [
  "Cairo", "Alexandria", "Giza", "Dubai", "Riyadh",
  "Istanbul", "London", "Paris", "New York", "Tokyo",
  "Barcelona", "Amsterdam", "Berlin", "Rome", "Sydney"
];

const fruitsData = [
  {
    id: 1,
    name: "Apple",
    category: "Alkaline",
    price: 35,
    unit: "kg",
    image: "assets/image/Apple.avif",
    description: "A crisp and refreshing apple with a perfect balance of sweetness and tartness. Rich in fiber, vitamin C, and antioxidants. Sourced from high-altitude orchards for the finest quality.",
    type: "Pome Fruit",
    supplierName: "GreenValley Farms",
    suppliers: [
      {
        id: "s1",
        supplierName: "GreenValley Farms",
        sinceWhen: "2018-03-15",
        city: "London",
        contactPerson: "James Harrington",
        phone: "+44 20 7946 0958"
      },
      {
        id: "s2",
        supplierName: "OrchardFresh Ltd.",
        sinceWhen: "2020-07-01",
        city: "Berlin",
        contactPerson: "Anna Müller",
        phone: "+49 30 2355 6790"
      }
    ]
  },
  {
    id: 2,
    name: "Mango",
    category: "Acidic",
    price: 60,
    unit: "kg",
    image: "assets/image/Mango.jpg",
    description: "The king of fruits — juicy, tropical, and irresistibly sweet. Packed with vitamins A and C, mangoes are hand-picked at peak ripeness from sun-drenched orchards.",
    type: "Drupe Fruit",
    supplierName: "TropicBurst Co.",
    suppliers: [
      {
        id: "s3",
        supplierName: "TropicBurst Co.",
        sinceWhen: "2017-01-20",
        city: "Dubai",
        contactPerson: "Khalid Al-Rashid",
        phone: "+971 4 310 0200"
      },
      {
        id: "s4",
        supplierName: "SunHarvest Exports",
        sinceWhen: "2021-05-10",
        city: "Cairo",
        contactPerson: "Omar Hassan",
        phone: "+20 2 2345 6789"
      }
    ]
  },
  {
    id: 3,
    name: "Strawberry",
    category: "Acidic",
    price: 80,
    unit: "kg",
    image: "assets/image/Strawberry.webp",
    description: "Bright, ruby-red strawberries bursting with summer sweetness. High in vitamin C, manganese, and powerful antioxidants. Perfect for desserts, smoothies, or eating fresh.",
    type: "Aggregate Fruit",
    supplierName: "BerryBliss Gardens",
    suppliers: [
      {
        id: "s5",
        supplierName: "BerryBliss Gardens",
        sinceWhen: "2019-04-12",
        city: "Paris",
        contactPerson: "Sophie Dubois",
        phone: "+33 1 4523 7890"
      },
      {
        id: "s6",
        supplierName: "Mohamed Bayoumy",
        sinceWhen: "2003-02-13",
        city: "Paris",
        contactPerson: "Ahmed Elsayed",
        phone: "+20 102 4800 476"
      },
      
    ]
  },
  {
    id: 4,
    name: "Watermelon",
    category: "Alkaline",
    price: 20,
    unit: "kg",
    image: "assets/image/Watermelon.jpg",
    description: "Cool and hydrating with a luscious red interior. Watermelon is 92% water, making it perfect for hot days. Rich in lycopene, vitamins A, B6, and C.",
    type: "Pepo Fruit",
    supplierName: "Nile Delta Produce",
    suppliers: [
      {
        id: "s7",
        supplierName: "Nile Delta Produce",
        sinceWhen: "2016-06-05",
        city: "Cairo",
        contactPerson: "Youssef Kamal",
        phone: "+20 2 2987 6543"
      },
      {
        id: "s8",
        supplierName: "SunGrown Exports",
        sinceWhen: "2022-02-14",
        city: "Alexandria",
        contactPerson: "Nadia Ibrahim",
        phone: "+20 3 4876 2310"
      }
    ]
  },
  {
    id: 5,
    name: "Grapes",
    category: "Acidic",
    price: 55,
    unit: "kg",
    image: "assets/image/Grapes.png",
    description: "Plump, seedless grapes with a satisfying snap and deep, complex flavor. Loaded with resveratrol and antioxidants. Available in green, red, and black varieties.",
    type: "Berry Fruit",
    supplierName: "Vineyard Select",
    suppliers: [
      {
        id: "s9",
        supplierName: "Vineyard Select",
        sinceWhen: "2015-09-23",
        city: "Barcelona",
        contactPerson: "Carlos Fernández",
        phone: "+34 93 456 7890"
      },
      {
        id: "s10",
        supplierName: "MediFresh Group",
        sinceWhen: "2020-11-30",
        city: "Rome",
        contactPerson: "Marco Rossi",
        phone: "+39 06 4567 8901"
      }
    ]
  },
  {
    id: 6,
    name: "Orange",
    category: "Acidic",
    price: 30,
    unit: "kg",
    image: "assets/image/Orange.jpg",
    description: "Sun-ripened oranges with a vibrant aroma and a burst of vitamin C in every slice. Thin-skinned and extra juicy, perfect for fresh-squeezed juice or snacking.",
    type: "Hesperidium Fruit",
    supplierName: "CitrusSun Farms",
    suppliers: [
      {
        id: "s11",
        supplierName: "CitrusSun Farms",
        sinceWhen: "2018-12-01",
        city: "Riyadh",
        contactPerson: "Ahmed Al-Saud",
        phone: "+966 11 234 5678"
      }
    ]
  },
  {
    id: 7,
    name: "Banana",
    category: "Alkaline",
    price: 15,
    unit: "kg",
    image: "assets/image/Banana.jpg",
    description: "Creamy, naturally sweet bananas — nature's most convenient snack. An excellent source of potassium, B6, and dietary fiber. Ethically sourced from certified tropical farms.",
    type: "Berry Fruit",
    supplierName: "TropicalRoots Inc.",
    suppliers: [
      {
        id: "s12",
        supplierName: "TropicalRoots Inc.",
        sinceWhen: "2014-03-08",
        city: "Amsterdam",
        contactPerson: "Pieter van Dijk",
        phone: "+31 20 789 0123"
      },
      {
        id: "s13",
        supplierName: "BananaLeaf Exports",
        sinceWhen: "2023-01-15",
        city: "Istanbul",
        contactPerson: "Elif Şahin",
        phone: "+90 212 345 6789"
      }
    ]
  },
  {
    id: 8,
    name: "Pineapple",
    category: "Acidic",
    price: 45,
    unit: "kg",
    image: "assets/image/Pineapple.webp",
    description: "Bold, tropical pineapple with a fiery sweetness and refreshing tang. Loaded with bromelain enzyme, vitamin C, and manganese. Hand-harvested from sun-drenched plantations.",
    type: "Multiple Fruit",
    supplierName: "TropicCrown Exports",
    suppliers: [
      {
        id: "s14",
        supplierName: "TropicCrown Exports",
        sinceWhen: "2016-08-20",
        city: "Dubai",
        contactPerson: "Rania Khalil",
        phone: "+971 4 555 0321"
      },
      {
        id: "s15",
        supplierName: "GoldenIsle Farms",
        sinceWhen: "2020-03-10",
        city: "Amsterdam",
        contactPerson: "Lars van Houten",
        phone: "+31 20 654 9870"
      }
    ]
  },
  {
    id: 9,
    name: "Kiwi",
    category: "Acidic",
    price: 90,
    unit: "kg",
    image: "assets/image/Kiwi.jpg",
    description: "Small but mighty — kiwi packs more vitamin C than an orange in its bright green flesh. A tangy-sweet flavor with a smooth finish. Sourced from high-altitude New Zealand-style farms.",
    type: "Berry Fruit",
    supplierName: "GreenKiwi Global",
    suppliers: [
      {
        id: "s16",
        supplierName: "GreenKiwi Global",
        sinceWhen: "2017-04-14",
        city: "Sydney",
        contactPerson: "Olivia Bennett",
        phone: "+61 2 9876 5432"
      }
    ]
  },
  {
    id: 10,
    name: "Peach",
    category: "Acidic",
    price: 65,
    unit: "kg",
    image: "assets/image/Peach.jpg",
    description: "Velvety, sun-kissed peaches with a honey-sweet aroma and juicy flesh. Rich in vitamins A and C, potassium, and dietary fiber. Perfect for eating fresh or baking.",
    type: "Drupe Fruit",
    supplierName: "SunKiss Orchards",
    suppliers: [
      {
        id: "s17",
        supplierName: "SunKiss Orchards",
        sinceWhen: "2018-06-01",
        city: "Paris",
        contactPerson: "Camille Fontaine",
        phone: "+33 1 5678 9012"
      },
      {
        id: "s18",
        supplierName: "VelvetFruit GmbH",
        sinceWhen: "2021-09-15",
        city: "Berlin",
        contactPerson: "Klaus Fischer",
        phone: "+49 30 9876 5432"
      }
    ]
  },
  {
    id: 11,
    name: "Lemon",
    category: "Acidic",
    price: 25,
    unit: "kg",
    image: "assets/image/Lemon.jpg",
    description: "Intensely zesty lemons with a sharp, clean acidity that brightens any dish or drink. A kitchen essential packed with vitamin C, citric acid, and natural antibacterial properties.",
    type: "Hesperidium Fruit",
    supplierName: "ZestFresh Trading",
    suppliers: [
      {
        id: "s19",
        supplierName: "ZestFresh Trading",
        sinceWhen: "2014-01-10",
        city: "Alexandria",
        contactPerson: "Tarek Mansour",
        phone: "+20 3 5432 1098"
      },
      {
        id: "s20",
        supplierName: "CitroMed Exports",
        sinceWhen: "2020-05-20",
        city: "Rome",
        contactPerson: "Giulia Marino",
        phone: "+39 06 8765 4321"
      }
    ]
  }
];