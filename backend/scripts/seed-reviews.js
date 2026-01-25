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
  'บ้านใหม่มาก สะอาด ครบครันทุกอย่าง',
  'ทำเลดีมาก ใกล้รถไฟฟ้าและสถานีรถไฟ',
  'เจ้าของใจดีมาก ตอบข้อสงสัยรวดเร็ว',
  'ราคาเหมาะสมกับทำเลและคุณภาพ',
  'บรรยากาศเงียบสงบ เหมาะสำหรับทำงานที่บ้าน',
  'ตกแต่งสวยงาม มีสไตล์โมเดิร์น',
  'พื้นที่ใช้สอยกว้างขวาง มากกว่าที่คิด',
  'ระบบรักษาความปลอดภัยดีมาก',
  'ใกล้ร้านอาหารและห้างสรรพสินค้าหลายแห่ง',
  'เจ้าของบริการดีมาก ตอบสนองทุกความต้องการ',
  'Perfect for remote work with excellent internet',
  'Great natural lighting throughout the property',
  'Well-designed layout maximizes space efficiently',
  'Quiet neighborhood perfect for families',
  'Close to schools and parks',
  'Modern kitchen with all necessary appliances',
  'Comfortable living space with great ventilation',
  'Secure building with 24/7 security',
  'Easy parking available nearby',
  'Great value compared to similar properties',
  'Responsive property management team',
  'Clean and well-maintained common areas',
  'Excellent location for daily commute',
  'Spacious balcony with nice views',
  'Well-insulated, stays cool in summer',
  'Good water pressure and hot water system',
  'Nearby public transportation is very convenient',
  'Safe area with friendly neighbors',
  'Property is exactly as described',
  'Would definitely recommend to others',
  'Great investment for rental income',
  'Perfect starter home for young families',
  'Well-established neighborhood with amenities',
  'Easy access to highways and main roads',
  'Good resale value in this area',
  'Property has great potential for renovation',
  'Surrounded by green spaces and parks',
  'Close to shopping centers and markets',
  'Excellent schools in the vicinity',
  'Peaceful environment away from city noise',
  'Modern design with high-quality materials',
  'Energy-efficient features reduce utility costs',
  'Spacious storage areas throughout',
  'Well-planned interior layout',
  'Great for hosting guests and gatherings',
  'Property feels like home immediately',
  'Exceeded all our expectations',
  'Highly satisfied with the purchase',
  'Professional and helpful real estate agent',
  'Smooth transaction process',
  'Property inspection revealed no major issues',
  'Great neighborhood for raising children',
  'Close to medical facilities and hospitals',
  'Excellent internet and connectivity options',
  'Well-maintained landscaping and gardens',
  'Good property management services',
  'Reasonable maintenance fees',
  'Property has appreciated in value',
  'Great location for business professionals',
  'Easy access to entertainment and dining',
  'Safe and secure gated community',
  'Well-lit streets and common areas',
  'Good drainage system, no flooding issues',
  'Property has good feng shui',
  'Well-ventilated with good air circulation',
  'Close to cultural attractions and museums',
  'Great for pet owners',
  'Property has character and charm',
  'Well-preserved historical features',
  'Modern amenities in traditional setting',
  'Great for weekend getaways',
  'Property offers privacy and tranquility',
  'Excellent views from upper floors',
  'Well-connected to city center',
  'Great for first-time homebuyers',
  'Property has good rental yield',
  'Well-documented property history',
  'No hidden issues or surprises',
  'Great community atmosphere',
  'Property meets all our requirements',
  'Would buy again if given the chance',
  'Excellent property for long-term investment',
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

      // Generate reviews for this property
      const reviews = [];
      for (let i = 0; i < numReviews; i++) {
        const rating = getRandomRating();
        const daysAgo = getRandomNumber(0, 365); // Random date within last year
        
        reviews.push({
          propertyId: propertyId,
          rating: rating,
          comment: selectedComments[i],
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
