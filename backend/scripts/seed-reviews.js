// Seed script for property reviews
// Run with: node scripts/seed-reviews.js
// Make sure MongoDB is running and connection string is correct

const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

// Load environment variables from .env file manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnvFile();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_USERNAME = process.env.DB_USERNAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'realestate';
const DB_SSL = process.env.DB_SSL === 'true';

let MONGODB_URI;
if (DB_USERNAME && DB_PASSWORD) {
  MONGODB_URI = `mongodb://${DB_USERNAME}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
} else {
  MONGODB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// Extensive list of unique review comments
const reviewComments = [
  'สถานที่สวยงามมาก บรรยากาศดี เหมาะสำหรับครอบครัว',
  'ราคาคุ้มค่ามาก พื้นที่กว้างขวาง ตกแต่งสวยงาม',
  'ทำเลดีมาก ใกล้สถานที่สำคัญ เดินทางสะดวก',
  'เจ้าของใจดี บริการดีมาก แนะนำเลย',
  'บ้านสวยมาก ครบครันทุกอย่าง ราคาเหมาะสม',
  'Perfect location, beautiful property, highly recommended!',
  'Great value for money, spacious and well-maintained',
  'Excellent property with amazing views and modern amenities',
  'Very satisfied with the property, clean and comfortable',
  'Outstanding property, exceeded our expectations',
  'สวยงามมาก บรรยากาศดี เหมาะสำหรับการอยู่อาศัย',
  'ราคาเหมาะสม พื้นที่กว้างขวาง ตกแต่งสวยงาม',
  'ทำเลดี เดินทางสะดวก ใกล้สถานที่สำคัญ',
  'เจ้าของใจดี บริการดีมาก แนะนำให้ทุกคน',
  'บ้านสวยมาก ครบครันทุกอย่าง ราคาคุ้มค่า',
  'บรรยากาศเงียบสงบ เหมาะสำหรับพักผ่อน',
  'ตกแต่งทันสมัย มีอุปกรณ์ครบครัน',
  'ทำเลดีมาก ใกล้ห้างสรรพสินค้าและร้านอาหาร',
  'เจ้าของบ้านเป็นมิตรมาก บริการดีเยี่ยม',
  'ราคาเหมาะสมกับคุณภาพที่ได้รับ',
  'Beautiful property with excellent facilities',
  'Clean, modern, and well-equipped apartment',
  'Great neighborhood with easy access to public transport',
  'Highly recommend this property for families',
  'Amazing views and peaceful environment',
  'พื้นที่กว้างขวาง เหมาะสำหรับครอบครัวใหญ่',
  'ตกแต่งสวยงาม มีสไตล์',
  'ทำเลดี เดินทางสะดวก',
  'เจ้าของใจดี ตอบสนองรวดเร็ว',
  'ราคาคุ้มค่า คุณภาพดี',
  'Spacious rooms with modern design',
  'Well-maintained property with great amenities',
  'Perfect for long-term stay',
  'Safe neighborhood with friendly community',
  'Excellent value for the price',
  'บ้านสวย ตกแต่งดี มีอุปกรณ์ครบ',
  'ทำเลดี ใกล้สถานที่สำคัญ',
  'เจ้าของบริการดีมาก',
  'ราคาเหมาะสม คุณภาพดี',
  'บรรยากาศดี เหมาะสำหรับการอยู่อาศัย',
  'Property exceeded all our expectations',
  'Clean, comfortable, and well-located',
  'Great investment opportunity',
  'Highly satisfied with our stay',
  'Perfect combination of location and quality',
  'พื้นที่กว้างขวาง สะดวกสบาย',
  'ตกแต่งสวยงาม ทันสมัย',
  'ทำเลดี เดินทางง่าย',
  'เจ้าของเป็นมิตร บริการดี',
  'ราคาคุ้มค่า ดีมาก',
  'Beautiful and well-maintained property',
  'Excellent location with great amenities',
  'Highly recommended for anyone looking for quality',
  'Great experience overall',
  'บ้านสวยมาก ครบครันทุกอย่าง',
  'ทำเลดี ใกล้ทุกที่',
  'เจ้าของใจดีมาก',
  'ราคาเหมาะสม สมบูรณ์แบบ',
  'บรรยากาศดี เหมาะสำหรับทุกคน',
  'Outstanding property management',
  'Modern facilities with traditional charm',
  'Perfect for both short and long stays',
  'Great communication with property owner',
  'Value for money is excellent',
];

// Extensive list of unique user names
const userNames = [
  'สมชาย ใจดี',
  'สมหญิง รักบ้าน',
  'John Smith',
  'Jane Doe',
  'วิไล สวยงาม',
  'David Brown',
  'Sarah Wilson',
  'ประเสริฐ ดีมาก',
  'Michael Johnson',
  'Emily Davis',
  'สุดา เก่งมาก',
  'Robert Taylor',
  'Lisa Anderson',
  'วิทยา ใจดี',
  'Maria Garcia',
  'James Wilson',
  'สมศักดิ์ รักดี',
  'Jennifer Martinez',
  'William Lee',
  'สุดารัตน์ สวยงาม',
  'Christopher White',
  'Amanda Thompson',
  'Daniel Harris',
  'ประยูร เก่งมาก',
  'Jessica Clark',
  'Matthew Lewis',
  'สมหมาย ใจดี',
  'Ashley Walker',
  'Andrew Hall',
  'นงเยาว์ สวยงาม',
  'Joshua Allen',
  'Michelle Young',
  'Ryan King',
  'สมบูรณ์ ดีมาก',
  'Nicole Wright',
  'Kevin Lopez',
  'ประพันธ์ รักดี',
  'Stephanie Hill',
  'Brian Scott',
  'สุดใจ เก่งมาก',
  'Brandon Green',
  'Rebecca Adams',
  'Edward Baker',
  'สมพร ใจดี',
  'Laura Nelson',
  'Jason Carter',
  'ประเสริฐ สวยงาม',
  'Melissa Mitchell',
  'Eric Perez',
  'สุดา รักดี',
  'Steven Roberts',
  'Kimberly Turner',
  'Timothy Phillips',
  'สมศักดิ์ ดีมาก',
  'Angela Campbell',
  'Patrick Parker',
  'ประยูร เก่งมาก',
  'Christina Evans',
  'Sean Edwards',
  'สุดารัตน์ ใจดี',
  'Rachel Collins',
  'Nathan Stewart',
  'สมหมาย สวยงาม',
  'Samantha Sanchez',
  'Justin Morris',
  'นงเยาว์ รักดี',
  'Katherine Rogers',
  'Benjamin Reed',
  'สมบูรณ์ ดีมาก',
  'Lauren Cook',
  'Alexander Morgan',
  'ประพันธ์ เก่งมาก',
  'Megan Bell',
  'Tyler Murphy',
  'สุดใจ ใจดี',
  'Olivia Bailey',
  'Zachary Rivera',
  'สมพร สวยงาม',
  'Grace Cooper',
  'Jordan Richardson',
  'ประเสริฐ รักดี',
  'Sophia Cox',
  'Cameron Howard',
  'สุดา ดีมาก',
  'Emma Ward',
  'Logan Torres',
  'สมศักดิ์ เก่งมาก',
  'Ava Peterson',
  'Hunter Gray',
  'ประยูร ใจดี',
  'Isabella Ramirez',
  'Connor James',
  'สุดารัตน์ สวยงาม',
  'Mia Watson',
  'Aiden Brooks',
  'สมหมาย รักดี',
  'Charlotte Kelly',
  'Lucas Sanders',
  'นงเยาว์ ดีมาก',
  'Amelia Price',
  'Mason Bennett',
  'สมบูรณ์ เก่งมาก',
  'Harper Wood',
  'Ethan Barnes',
  'ประพันธ์ ใจดี',
  'Evelyn Ross',
  'Noah Henderson',
  'สุดใจ สวยงาม',
  'Abigail Coleman',
  'Liam Jenkins',
  'สมพร รักดี',
  'Elizabeth Perry',
  'Mason Powell',
  'ประเสริฐ ดีมาก',
  'Sofia Long',
  'Jackson Patterson',
  'สุดา เก่งมาก',
  'Avery Hughes',
  'Sebastian Flores',
  'สมศักดิ์ ใจดี',
  'Scarlett Washington',
  'Aria Butler',
  'ประยูร สวยงาม',
  'Luna Simmons',
  'Chloe Foster',
  'สุดารัตน์ รักดี',
  'Layla Gonzales',
  'Zoe Bryant',
  'สมหมาย ดีมาก',
  'Nora Alexander',
  'Hannah Russell',
  'นงเยาว์ เก่งมาก',
  'Lillian Griffin',
  'Addison Diaz',
  'สมบูรณ์ ใจดี',
  'Natalie Hayes',
  'Victoria Myers',
  'ประพันธ์ สวยงาม',
  'Brooklyn Ford',
  'Zoe Hamilton',
  'สุดใจ รักดี',
  'Leah Graham',
  'Audrey Sullivan',
  'สมพร ดีมาก',
  'Savannah Wallace',
  'Allison Woods',
  'ประเสริฐ เก่งมาก',
  'Bella Cole',
  'Stella West',
  'สุดา ใจดี',
  'Lucy Brooks',
  'Paisley Jordan',
  'สมศักดิ์ สวยงาม',
  'Skylar Owens',
  'Layla Reynolds',
  'ประยูร รักดี',
  'Willow Fisher',
  'Nova Ellis',
  'สุดารัตน์ ดีมาก',
  'Hazel Harrison',
  'Violet Gibson',
  'สมหมาย เก่งมาก',
  'Aurora Mendoza',
  'Ivy Moreno',
  'นงเยาว์ ใจดี',
  'Penelope Bowman',
  'Eleanor Medina',
  'สมบูรณ์ สวยงาม',
  'Luna Fowler',
  'Claire Brewer',
  'ประพันธ์ รักดี',
  'Aria Hoffman',
  'Caroline Carlson',
  'สุดใจ ดีมาก',
  'Nora Silva',
  'Maya Pearson',
  'สมพร เก่งมาก',
  'Elena Delgado',
  'Ariana Valdez',
  'ประเสริฐ ใจดี',
  'Genesis Pena',
  'Aaliyah Rios',
  'สุดา สวยงาม',
  'Naomi Douglas',
  'Elena Sandoval',
  'สมศักดิ์ รักดี',
  'Sarah Barrett',
  'Anna Hopkins',
  'ประยูร ดีมาก',
  'Allison Keller',
  'Gabriella Guerrero',
  'สุดารัตน์ เก่งมาก',
  'Samantha Stanley',
  'Madison Bates',
  'สมหมาย ใจดี',
  'Alexis Alvarado',
  'Isabelle Beck',
  'นงเยาว์ สวยงาม',
  'Mariah Ortega',
  'Jocelyn Black',
  'สมบูรณ์ รักดี',
  'Brianna Stephens',
  'Makayla Potter',
  'ประพันธ์ ดีมาก',
  'Kaylee Thornton',
  'Destiny Dennis',
  'สุดใจ เก่งมาก',
  'Liliana Lowe',
  'Aubrey Lynch',
  'สมพร ใจดี',
  'Kylie Farmer',
  'Bailey Salinas',
  'ประเสริฐ สวยงาม',
  'Mackenzie O\'Brien',
  'Payton Barrera',
  'สุดา รักดี',
  'Reagan McDaniel',
  'Rylee Levy',
  'สมศักดิ์ ดีมาก',
  'Adriana Hodge',
  'Jade Massey',
  'ประยูร เก่งมาก',
  'Lyla Roach',
  'Maya Hogan',
  'สุดารัตน์ ใจดี',
  'Quinn Merritt',
  'Ivy Mckee',
  'สมหมาย สวยงาม',
  'Piper Strong',
  'Willow Conway',
  'นงเยาว์ รักดี',
  'Paisley Stein',
  'Nova Whitehead',
  'สมบูรณ์ ดีมาก',
  'Hazel Bullock',
  'Violet Escobar',
  'ประพันธ์ เก่งมาก',
  'Aurora Knapp',
  'Ivy Melton',
  'สุดใจ ใจดี',
  'Penelope Swanson',
  'Eleanor Schwartz',
  'สมพร สวยงาม',
  'Luna Schroeder',
  'Claire Matthews',
  'ประเสริฐ รักดี',
  'Aria Francis',
  'Caroline Goodwin',
  'สุดา ดีมาก',
  'Nora Manning',
  'Maya Walters',
  'สมศักดิ์ เก่งมาก',
  'Elena Curry',
  'Ariana Tyler',
  'ประยูร ใจดี',
  'Genesis Chase',
  'Aaliyah Mckinney',
  'สุดารัตน์ สวยงาม',
  'Naomi Campos',
  'Elena Morton',
  'สมหมาย รักดี',
  'Sarah Harrington',
  'Anna Casey',
  'นงเยาว์ ดีมาก',
  'Allison Patton',
  'Gabriella Boone',
  'สมบูรณ์ เก่งมาก',
  'Samantha Cortez',
  'Madison Clarke',
  'ประพันธ์ ใจดี',
  'Alexis Mathis',
  'Isabelle Singleton',
  'สุดใจ สวยงาม',
  'Mariah Wilkins',
  'Jocelyn Cain',
  'สมพร รักดี',
  'Brianna Bryan',
  'Makayla Underwood',
  'ประเสริฐ ดีมาก',
  'Kaylee Hogan',
  'Destiny McKenzie',
  'สุดา เก่งมาก',
  'Liliana Collier',
  'Aubrey Luna',
  'สมศักดิ์ ใจดี',
  'Kylie Phelps',
  'Bailey McGuire',
  'ประยูร สวยงาม',
  'Mackenzie Allison',
  'Payton Bridges',
  'สุดารัตน์ รักดี',
  'Reagan Wilkerson',
  'Rylee Nash',
  'สมหมาย ดีมาก',
  'Adriana Summers',
  'Jade Atkinso',
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRating() {
  // Generate rating between 3-5 with slight variation
  // 60% chance of 4-5, 40% chance of 3-4
  const rand = Math.random();
  if (rand < 0.6) {
    return getRandomNumber(4, 5);
  } else {
    return getRandomNumber(3, 4);
  }
}

async function seedReviews() {
  const clientOptions = {
    retryWrites: true,
    w: 'majority',
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
  };

  if (DB_SSL) {
    clientOptions.tls = true;
    clientOptions.tlsAllowInvalidCertificates = true;
  }

  const client = new MongoClient(MONGODB_URI, clientOptions);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Fetch all properties from ms_properties
    const properties = await db.collection('ms_properties')
      .find({ isVoid: { $ne: true } })
      .toArray();

    if (properties.length === 0) {
      console.log('⚠️  No properties found in ms_properties collection.');
      console.log('   Please seed properties first.');
      process.exit(1);
    }

    console.log(`📋 Found ${properties.length} properties to seed reviews for`);

    // Clear all existing reviews
    await db.collection('ss_property_reviews').deleteMany({});
    console.log('✅ Cleared all existing reviews');

    let totalReviewsCreated = 0;

    // Shuffle arrays once for variety
    const shuffledComments = shuffleArray(reviewComments);
    const shuffledUserNames = shuffleArray(userNames);

    // Process each property
    for (let propIndex = 0; propIndex < properties.length; propIndex++) {
      const property = properties[propIndex];
      const propertyId = property._id;

      // Randomly choose number of reviews: 3, 5, or 10
      const reviewCounts = [3, 5, 10];
      const numReviews = reviewCounts[Math.floor(Math.random() * reviewCounts.length)];

      // Get unique comments for this property
      // Start from different positions in the shuffled array for each property
      const commentStartIndex = (propIndex * numReviews) % shuffledComments.length;
      const selectedComments = [];
      for (let i = 0; i < numReviews; i++) {
        const commentIndex = (commentStartIndex + i) % shuffledComments.length;
        selectedComments.push(shuffledComments[commentIndex]);
      }

      // Get unique user names for this property (no duplicates)
      // Start from different positions in the shuffled array for each property
      const userNameStartIndex = (propIndex * numReviews) % shuffledUserNames.length;
      const selectedUserNames = [];
      const usedUserNames = new Set();
      
      for (let i = 0; i < numReviews; i++) {
        let userName;
        let attempts = 0;
        do {
          const userNameIndex = (userNameStartIndex + i + attempts) % shuffledUserNames.length;
          userName = shuffledUserNames[userNameIndex];
          attempts++;
          // Prevent infinite loop
          if (attempts > shuffledUserNames.length) {
            // If we run out of unique names, add a number suffix
            userName = shuffledUserNames[userNameStartIndex] + ` ${i + 1}`;
            break;
          }
        } while (usedUserNames.has(userName));
        
        usedUserNames.add(userName);
        selectedUserNames.push(userName);
      }

      // Generate reviews for this property
      const reviews = [];
      for (let i = 0; i < numReviews; i++) {
        const rating = getRandomRating();
        const daysAgo = getRandomNumber(0, 365); // Random date within last year
        
        reviews.push({
          propertyId: propertyId,
          rating: rating,
          comment: selectedComments[i],
          userName: selectedUserNames[i],
          status: 'active',
          createdAt: new Date(Date.now() - daysAgo * 86400000),
          updatedAt: new Date(Date.now() - daysAgo * 86400000),
          isVoid: false,
        });
      }

      // Insert reviews for this property
      if (reviews.length > 0) {
        await db.collection('ss_property_reviews').insertMany(reviews);
        totalReviewsCreated += reviews.length;
        console.log(`✅ Created ${reviews.length} reviews for property: ${property.title}`);
      }
    }

    // Show summary
    const allReviews = await db.collection('ss_property_reviews').find({}).toArray();
    console.log(`\n📊 Summary:`);
    console.log(`   Total properties processed: ${properties.length}`);
    console.log(`   Total reviews created: ${totalReviewsCreated}`);
    console.log(`   Total reviews in database: ${allReviews.length}`);

    // Show review count distribution
    const reviewCountsByProperty = {};
    for (const review of allReviews) {
      const propId = review.propertyId.toString();
      reviewCountsByProperty[propId] = (reviewCountsByProperty[propId] || 0) + 1;
    }
    
    const counts = Object.values(reviewCountsByProperty);
    const count3 = counts.filter(c => c === 3).length;
    const count5 = counts.filter(c => c === 5).length;
    const count10 = counts.filter(c => c === 10).length;
    
    console.log(`\n📈 Review count distribution:`);
    console.log(`   Properties with 3 reviews: ${count3}`);
    console.log(`   Properties with 5 reviews: ${count5}`);
    console.log(`   Properties with 10 reviews: ${count10}`);

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

seedReviews();
