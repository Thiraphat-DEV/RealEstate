# Mockup Data for Real Estate Backend

This directory contains CSV files with mockup data for importing into MongoDB collections.

## Files

- `ms_city.csv` - Master city data (Bangkok, Chiang Mai, Phuket, etc.)
- `ms_properties_status.csv` - Property statuses (Available, Sold, Rented, etc.)
- `ms_properties_type.csv` - Property types (Apartment, Condo, House, etc.)
- `ms_address.csv` - Address data with city references

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

## Notes

- The import script will skip existing records (based on unique fields)
- Cities are imported first, then addresses can reference them
- The script handles relationships between collections automatically
