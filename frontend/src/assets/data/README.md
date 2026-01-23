# Location Master Data

ไฟล์ master data สำหรับประเทศและสถานที่ของคอนโด

## ไฟล์

- **`locations-master.csv`** - ไฟล์ CSV ต้นฉบับ (100 สถานที่)
- **`locations.ts`** - ไฟล์ TypeScript constant สำหรับใช้งานในแอป

## โครงสร้างข้อมูล

แต่ละแถวมีข้อมูลดังนี้:

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | ID ของสถานที่ |
| `country` | string | ชื่อประเทศ |
| `location` | string | ชื่อสถานที่หลัก |
| `region` | string | ภูมิภาค |
| `city` | string | เมือง |
| `district` | string | เขต/แขวง |
| `postal_code` | string | รหัสไปรษณีย์ |
| `latitude` | number | ละติจูด |
| `longitude` | number | ลองจิจูด |

## ประเทศที่รวมอยู่

- 🇹🇭 Thailand (30 สถานที่)
- 🇸🇬 Singapore (10 สถานที่)
- 🇲🇾 Malaysia (10 สถานที่)
- 🇮🇩 Indonesia (8 สถานที่)
- 🇵🇭 Philippines (8 สถานที่)
- 🇻🇳 Vietnam (11 สถานที่)
- 🇰🇭 Cambodia (5 สถานที่)
- 🇲🇲 Myanmar (3 สถานที่)
- 🇱🇦 Laos (3 สถานที่)
- 🇯🇵 Japan (8 สถานที่)
- 🇰🇷 South Korea (4 สถานที่)

## วิธีการใช้งาน

### 1. ใช้ locationService

```typescript
import { locationService } from '../services/locationService'

// ดึงข้อมูลทั้งหมด
const allLocations = locationService.getAll()

// ดึงรายชื่อประเทศ
const countries = locationService.getCountries()

// ดึงสถานที่ตามประเทศ
const thailandLocations = locationService.getByCountry('Thailand')

// ค้นหาสถานที่
const results = locationService.search('Bangkok')
```

### 2. ใช้ locationUtils

```typescript
import { 
  getCountries, 
  getLocationsByCountry,
  formatLocationName 
} from '../utils/locationUtils'
import { locationsMaster } from '../assets/data/locations'

const countries = getCountries(locationsMaster)
const bangkokLocations = getLocationsByCountry(locationsMaster, 'Thailand')
```

## การอัพเดทข้อมูล

1. แก้ไขไฟล์ `locations-master.csv`
2. รัน script เพื่อแปลงเป็น TypeScript (ถ้ามี)
3. หรือแก้ไข `locations.ts` โดยตรง

## หมายเหตุ

- ข้อมูลเป็น mockup data สำหรับ development
- ข้อมูลพิกัด (latitude/longitude) เป็นค่าประมาณ
- สามารถเพิ่มข้อมูลใหม่ได้ตามต้องการ
