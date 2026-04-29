const citiesEntitySet = {
  value: [
    { Name: "Cairo" },
    { Name: "Alexandria" },
    { Name: "Giza" },
    { Name: "Mansoura" },
    { Name: "Tanta" },
    { Name: "Zagazig" },
    { Name: "Ismailia" },
    { Name: "Port Said" },
    { Name: "Suez" },
    { Name: "Fayoum" },
    { Name: "Beni Suef" },
    { Name: "Minya" },
    { Name: "Assiut" },
    { Name: "Sohag" },
    { Name: "Aswan" }
  ]
};

const fruitsEntitySet = {
  value: [
    {
      ID: 1,
      Name: "Apple",
      Category: "Alkaline",
      Price: 35,
      Unit: "kg",
      Image: "assets/image/Apple.avif",
      Description: "Fresh Egyptian apples with a balanced sweet taste and crisp texture. Ideal for daily consumption and rich in fiber and vitamins.",
      Type: "Pome Fruit",
      SupplierName: "Delta Fresh Farms"
    },
    {
      ID: 2,
      Name: "Mango",
      Category: "Acidic",
      Price: 60,
      Unit: "kg",
      Image: "assets/image/Mango.jpg",
      Description: "Premium Egyptian mangoes known for their rich flavor and juicy texture. Carefully selected from local farms during peak season.",
      Type: "Drupe Fruit",
      SupplierName: "Nile Mango Traders"
    },
    {
      ID: 3,
      Name: "Strawberry",
      Category: "Acidic",
      Price: 80,
      Unit: "kg",
      Image: "assets/image/Strawberry.webp",
      Description: "Bright red strawberries grown in Egypt with a sweet aroma and soft juicy texture. Perfect for desserts and fresh eating.",
      Type: "Aggregate Fruit",
      SupplierName: "Berry Egypt"
    },
    {
      ID: 4,
      Name: "Watermelon",
      Category: "Alkaline",
      Price: 20,
      Unit: "kg",
      Image: "assets/image/Watermelon.jpg",
      Description: "Large Egyptian watermelon with refreshing flavor and high water content. A popular summer fruit across local markets.",
      Type: "Pepo Fruit",
      SupplierName: "Nile Delta Produce"
    },
    {
      ID: 5,
      Name: "Grapes",
      Category: "Acidic",
      Price: 55,
      Unit: "kg",
      Image: "assets/image/Grapes.png",
      Description: "Seedless Egyptian grapes with a sweet taste and crisp bite. Available in premium quality for local distribution.",
      Type: "Berry Fruit",
      SupplierName: "Upper Egypt Vineyards"
    },
    {
      ID: 6,
      Name: "Orange",
      Category: "Acidic",
      Price: 30,
      Unit: "kg",
      Image: "assets/image/Orange.jpg",
      Description: "Egyptian oranges with high juice content and rich citrus flavor. Commonly supplied for fresh markets and juice production.",
      Type: "Hesperidium Fruit",
      SupplierName: "Citrus El Wadi"
    },
    {
      ID: 7,
      Name: "Banana",
      Category: "Alkaline",
      Price: 15,
      Unit: "kg",
      Image: "assets/image/Banana.jpg",
      Description: "Naturally sweet bananas from Egyptian farms with soft texture and reliable quality. Suitable for daily sale and home use.",
      Type: "Berry Fruit",
      SupplierName: "Banana El Kheir"
    },
    {
      ID: 8,
      Name: "Pineapple",
      Category: "Acidic",
      Price: 45,
      Unit: "kg",
      Image: "assets/image/Pineapple.webp",
      Description: "Selected pineapple with a tropical flavor and balanced sweetness. Distributed locally through premium fruit suppliers.",
      Type: "Multiple Fruit",
      SupplierName: "Tropical Egypt Supply"
    },
    {
      ID: 9,
      Name: "Kiwi",
      Category: "Acidic",
      Price: 90,
      Unit: "kg",
      Image: "assets/image/Kiwi.jpg",
      Description: "High-quality kiwi fruit with a tangy and refreshing taste. Offered through specialty fruit distributors in Egypt.",
      Type: "Berry Fruit",
      SupplierName: "Green Valley Egypt"
    },
    {
      ID: 10,
      Name: "Peach",
      Category: "Acidic",
      Price: 65,
      Unit: "kg",
      Image: "assets/image/Peach.jpg",
      Description: "Soft Egyptian peaches with natural sweetness and aromatic flavor. Commonly sourced from Upper Egypt farms.",
      Type: "Drupe Fruit",
      SupplierName: "Sunrise Orchards Egypt"
    },
    {
      ID: 11,
      Name: "Lemon",
      Category: "Acidic",
      Price: 25,
      Unit: "kg",
      Image: "assets/image/Lemon.jpg",
      Description: "Fresh lemons with strong citrus aroma and sharp flavor. Widely used in households, restaurants, and juice outlets.",
      Type: "Hesperidium Fruit",
      SupplierName: "Zest Egypt Trading"
    }
  ]
};

const suppliersEntitySet = {
  value: [
    {
      ID: "s1",
      FruitID: 1,
      SupplierName: "Delta Fresh Farms",
      SinceWhen: "2018-03-15",
      City: "Cairo",
      ContactPerson: "Ahmed Mostafa",
      Phone: "+20 101 234 5678"
    },
    {
      ID: "s2",
      FruitID: 1,
      SupplierName: "El Nada Fruits",
      SinceWhen: "2020-07-01",
      City: "Giza",
      ContactPerson: "Mona Hassan",
      Phone: "+20 102 456 7890"
    },
    {
      ID: "s3",
      FruitID: 2,
      SupplierName: "Nile Mango Traders",
      SinceWhen: "2017-01-20",
      City: "Ismailia",
      ContactPerson: "Khaled Fathy",
      Phone: "+20 100 778 9911"
    },
    {
      ID: "s4",
      FruitID: 2,
      SupplierName: "Sun Harvest Egypt",
      SinceWhen: "2021-05-10",
      City: "Cairo",
      ContactPerson: "Omar Hassan",
      Phone: "+20 122 345 6789"
    },
    {
      ID: "s5",
      FruitID: 3,
      SupplierName: "Berry Egypt",
      SinceWhen: "2019-04-12",
      City: "Alexandria",
      ContactPerson: "Salma Adel",
      Phone: "+20 111 452 7890"
    },
    {
      ID: "s6",
      FruitID: 3,
      SupplierName: "Mohamed Bayoumy Fruits",
      SinceWhen: "2003-02-13",
      City: "Mansoura",
      ContactPerson: "Ahmed Elsayed",
      Phone: "+20 102 480 0476"
    },
    {
      ID: "s7",
      FruitID: 4,
      SupplierName: "Nile Delta Produce",
      SinceWhen: "2016-06-05",
      City: "Cairo",
      ContactPerson: "Youssef Kamal",
      Phone: "+20 109 298 7654"
    },
    {
      ID: "s8",
      FruitID: 4,
      SupplierName: "SunGrown Egypt",
      SinceWhen: "2022-02-14",
      City: "Alexandria",
      ContactPerson: "Nadia Ibrahim",
      Phone: "+20 120 487 6231"
    },
    {
      ID: "s9",
      FruitID: 5,
      SupplierName: "Upper Egypt Vineyards",
      SinceWhen: "2015-09-23",
      City: "Minya",
      ContactPerson: "Karim Nabil",
      Phone: "+20 155 456 7890"
    },
    {
      ID: "s10",
      FruitID: 5,
      SupplierName: "MediFresh Egypt",
      SinceWhen: "2020-11-30",
      City: "Sohag",
      ContactPerson: "Mahmoud Samir",
      Phone: "+20 128 567 8901"
    },
    {
      ID: "s11",
      FruitID: 6,
      SupplierName: "Citrus El Wadi",
      SinceWhen: "2018-12-01",
      City: "Beni Suef",
      ContactPerson: "Ahmed Saad",
      Phone: "+20 110 234 5678"
    },
    {
      ID: "s12",
      FruitID: 7,
      SupplierName: "Banana El Kheir",
      SinceWhen: "2014-03-08",
      City: "Aswan",
      ContactPerson: "Hany Reda",
      Phone: "+20 121 789 0123"
    },
    {
      ID: "s13",
      FruitID: 7,
      SupplierName: "El Baraka Banana Supply",
      SinceWhen: "2023-01-15",
      City: "Fayoum",
      ContactPerson: "Eman Sherif",
      Phone: "+20 100 345 6789"
    },
    {
      ID: "s14",
      FruitID: 8,
      SupplierName: "Tropical Egypt Supply",
      SinceWhen: "2016-08-20",
      City: "Port Said",
      ContactPerson: "Rania Khalil",
      Phone: "+20 114 555 0321"
    },
    {
      ID: "s15",
      FruitID: 8,
      SupplierName: "Golden Nile Fruits",
      SinceWhen: "2020-03-10",
      City: "Suez",
      ContactPerson: "Laila Atef",
      Phone: "+20 123 654 9870"
    },
    {
      ID: "s16",
      FruitID: 9,
      SupplierName: "Green Valley Egypt",
      SinceWhen: "2017-04-14",
      City: "Zagazig",
      ContactPerson: "Nourhan Tarek",
      Phone: "+20 127 987 6543"
    },
    {
      ID: "s17",
      FruitID: 10,
      SupplierName: "Sunrise Orchards Egypt",
      SinceWhen: "2018-06-01",
      City: "Assiut",
      ContactPerson: "Mariam Nader",
      Phone: "+20 112 567 9012"
    },
    {
      ID: "s18",
      FruitID: 10,
      SupplierName: "El Rowad Fruit Farms",
      SinceWhen: "2021-09-15",
      City: "Tanta",
      ContactPerson: "Khaled Ezz",
      Phone: "+20 115 987 6543"
    },
    {
      ID: "s19",
      FruitID: 11,
      SupplierName: "Zest Egypt Trading",
      SinceWhen: "2014-01-10",
      City: "Alexandria",
      ContactPerson: "Tarek Mansour",
      Phone: "+20 103 543 2109"
    },
    {
      ID: "s20",
      FruitID: 11,
      SupplierName: "Citro Nile Exports",
      SinceWhen: "2020-05-20",
      City: "Cairo",
      ContactPerson: "Ghada Ali",
      Phone: "+20 106 876 5432"
    }
  ]
};
