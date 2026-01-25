# Property Seed Scripts

Scripts สำหรับสร้างข้อมูลทดสอบ 100 properties พร้อม relation กับ address, propertyType, และ propertyStatus

## ไฟล์ที่สร้าง

1. **properties-seed.csv** - ไฟล์ CSV ที่มีข้อมูล 100 properties
2. **seed-properties-simple.js** - Script สำหรับ import ข้อมูลลง MongoDB โดยตรง
3. **seed-properties.ts** - TypeScript seed script สำหรับใช้กับ NestJS
4. **seed-reviews.js** - Script สำหรับสร้าง reviews และ rating data สำหรับ properties

## วิธีใช้งาน

### วิธีที่ 1: ใช้ MongoDB Script (แนะนำ)

```bash
# ตั้งค่า environment variables (ถ้าต้องการ)
export MONGODB_URI="mongodb://localhost:27017/realestate"
export DB_NAME="realestate"

# รัน script
node scripts/seed-properties-simple.js
```

Script นี้จะ:
- สร้าง property types, statuses, และ addresses อัตโนมัติ (ถ้ายังไม่มี)
- สร้าง properties 100 rows พร้อม relation กับ master data
- ลบข้อมูลเก่าออกก่อน (ถ้ามี)

### วิธีที่ 2: ใช้ CSV File

1. เปิดไฟล์ `properties-seed.csv`
2. แทนที่ `ADDRESS_ID_X` ด้วย ObjectId จริงจาก collection `ms_address`
3. แทนที่ `propertyType` และ `status` ด้วย ObjectId จริงจาก collections ที่เกี่ยวข้อง
4. Import ลง MongoDB โดยใช้ mongoimport หรือ MongoDB Compass

```bash
mongoimport --db realestate --collection ms_properties --type csv --headerline --file scripts/properties-seed.csv
```

### วิธีที่ 3: ใช้ NestJS TypeScript Script

```bash
# Compile และรัน
npm run build
node dist/scripts/seed-properties.js
```

## ข้อมูลที่สร้าง

- **100 properties** พร้อมข้อมูล:
  - title (สุ่มจากรายการ)
  - price (1,000,000 - 50,000,000 บาท)
  - location (8 จังหวัดในไทย)
  - description
  - bedrooms (1-5 ห้อง)
  - bathrooms (1-4 ห้อง)
  - area (30-300 ตารางเมตร)
  - propertyType (relation กับ ms_properties_type)
  - status (relation กับ ms_properties_status)
  - address (relation กับ ms_address)
  - images (3 รูปต่อ property)

## Seed Reviews

### วิธีใช้งาน seed-reviews.js

```bash
# รัน script เพื่อสร้าง reviews สำหรับ property "Premium Penthouse in Sathorn"
node scripts/seed-reviews.js
```

Script นี้จะ:
- ค้นหา property ที่มี title ประกอบด้วย "Premium Penthouse in Sathorn"
- ถ้าไม่เจอ จะสร้าง property ใหม่พร้อมข้อมูล:
  - Title: Premium Penthouse in Sathorn 1
  - Price: ฿21,863,798
  - Bedrooms: 5
  - Bathrooms: 1
  - Area: 36 ตารางเมตร
- สร้าง reviews 15 รายการพร้อม:
  - Rating: 3-5 stars (สุ่ม)
  - Comment: 80% มี comment (สุ่มจากรายการ)
  - UserName: สุ่มจากรายการชื่อ
  - Status: active

## หมายเหตุ

- Script จะสร้าง master data (property types, statuses, addresses) อัตโนมัติถ้ายังไม่มี
- ถ้ามีข้อมูลเก่าอยู่แล้ว จะถูกลบออกก่อนสร้างใหม่
- ObjectId สำหรับ relations จะถูกสุ่มจากข้อมูลที่มีอยู่
- Reviews script จะลบ reviews เก่าของ property นั้นๆ ก่อนสร้างใหม่
