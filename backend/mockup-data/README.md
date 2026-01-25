# Mockup Data for Real Estate Backend

This directory contains CSV files with mockup data for importing into MongoDB collections.

## Files

- `ms_city.csv` - Master city data (Bangkok, Chiang Mai, Phuket, etc.)
- `ms_properties_status.csv` - Property statuses (Available, Sold, Rented, etc.)
- `ms_properties_type.csv` - Property types (Apartment, Condo, House, etc.)
- `ms_address.csv` - Address data with city references
- `ms_properties.csv` - Property data (20 real estate properties)

## Import Data

To import all mockup data into MongoDB:

```bash
npm run import:mockup
```

Or using ts-node directly:

```bash
npx ts-node -r tsconfig-paths/register scripts/import-mockup-data.ts
```

## Data Structure

### ms_city.csv
- `code` - Unique city code (required)
- `name` - City name (required)
- `province` - Province name (required)
- `postalCode` - Postal code (optional)
- `country` - Country code (optional, default: TH)

### ms_properties_status.csv
- `code` - Status code (required, unique)
- `name` - Status name (required)

### ms_properties_type.csv
- `code` - Type code (required, unique)
- `name` - Type name (required)

### ms_address.csv
- `address` - Street address (required)
- `cityCode` - Reference to city code in ms_city (required)
- `district` - District name (optional)
- `subDistrict` - Sub-district name (optional)
- `postalCode` - Postal code (optional)
- `latitude` - Latitude coordinate (optional)
- `longitude` - Longitude coordinate (optional)

### ms_properties.csv
- `title` - Property title (required)
- `price` - Property price in THB (required)
- `location` - Location description (required)
- `description` - Property description (optional)
- `bedrooms` - Number of bedrooms (optional)
- `bathrooms` - Number of bathrooms (optional)
- `area` - Area in ตารางเมตร (optional)
- `propertyTypeCode` - Reference to property type code in ms_properties_type (required)
- `statusCode` - Reference to status code in ms_properties_status (required)
- `address` - Reference to address string in ms_address (optional)
- `images` - Comma-separated image URLs (optional)

## Notes

- The import script will skip existing records (based on unique fields)
- Import order: cities → statuses → types → addresses → properties
- Properties reference other master data by codes (propertyTypeCode, statusCode) and address string
- The script handles relationships between collections automatically
