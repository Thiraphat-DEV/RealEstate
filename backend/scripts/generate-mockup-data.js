const fs = require('fs');
const path = require('path');

// Generate ms_city.csv with 300 rows
function generateCities() {
  const cities = [
    'BKK', 'CM', 'PK', 'PT', 'HD', 'KK', 'UD', 'NK', 'SG', 'AY',
    'CR', 'LP', 'RB', 'SR', 'TR', 'YK', 'NS', 'PS', 'SK', 'YS',
    'BP', 'SP', 'KB', 'CN', 'RN', 'PN', 'PC', 'ST', 'UT', 'CT'
  ];
  const cityNames = [
    'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hua Hin', 'Khon Kaen',
    'Udon Thani', 'Nakhon Ratchasima', 'Songkhla', 'Ayutthaya',
    'Chonburi', 'Lampang', 'Ratchaburi', 'Surat Thani', 'Trang', 'Yala',
    'Nakhon Si Thammarat', 'Phitsanulok', 'Sakon Nakhon', 'Yasothon',
    'Buriram', 'Suphan Buri', 'Kanchanaburi', 'Chiang Rai', 'Ranong',
    'Phang Nga', 'Prachuap Khiri Khan', 'Satun', 'Uttaradit', 'Chanthaburi'
  ];
  const provinces = [
    'Bangkok', 'Chiang Mai', 'Phuket', 'Chonburi', 'Prachuap Khiri Khan',
    'Khon Kaen', 'Udon Thani', 'Nakhon Ratchasima', 'Songkhla', 'Ayutthaya',
    'Chonburi', 'Lampang', 'Ratchaburi', 'Surat Thani', 'Trang', 'Yala',
    'Nakhon Si Thammarat', 'Phitsanulok', 'Sakon Nakhon', 'Yasothon',
    'Buriram', 'Suphan Buri', 'Kanchanaburi', 'Chiang Rai', 'Ranong',
    'Phang Nga', 'Prachuap Khiri Khan', 'Satun', 'Uttaradit', 'Chanthaburi'
  ];

  let csv = 'code,name,province,postalCode,country\n';
  for (let i = 0; i < 300; i++) {
    const idx = i % cities.length;
    const code = cities[idx] + String(Math.floor(i / cities.length) + 1).padStart(2, '0');
    const name = cityNames[idx] + (Math.floor(i / cities.length) > 0 ? ' ' + (Math.floor(i / cities.length) + 1) : '');
    const province = provinces[idx];
    const postalCode = 10000 + (i % 1000);
    csv += `${code},${name},${province},${postalCode},TH\n`;
  }
  fs.writeFileSync(path.join(__dirname, '../mockup-data/ms_city.csv'), csv);
  console.log('✅ Generated ms_city.csv with 300 rows');
}

// Generate ms_properties_status.csv with 300 rows (repeating statuses)
function generateStatuses() {
  const statuses = [
    { code: 'AVAILABLE', name: 'Available' },
    { code: 'SOLD', name: 'Sold' },
    { code: 'RENTED', name: 'Rented' },
    { code: 'PENDING', name: 'Pending' },
    { code: 'RESERVED', name: 'Reserved' },
    { code: 'WITHDRAWN', name: 'Withdrawn' },
    { code: 'MAINTENANCE', name: 'Under Maintenance' },
    { code: 'INSPECTION', name: 'Under Inspection' },
    { code: 'NEGOTIATION', name: 'Under Negotiation' },
    { code: 'APPROVED', name: 'Approved' }
  ];

  let csv = 'code,name\n';
  for (let i = 0; i < 300; i++) {
    const status = statuses[i % statuses.length];
    const suffix = Math.floor(i / statuses.length);
    const code = suffix > 0 ? `${status.code}_${suffix + 1}` : status.code;
    const name = suffix > 0 ? `${status.name} ${suffix + 1}` : status.name;
    csv += `${code},${name}\n`;
  }
  fs.writeFileSync(path.join(__dirname, '../mockup-data/ms_properties_status.csv'), csv);
  console.log('✅ Generated ms_properties_status.csv with 300 rows');
}

// Generate ms_properties_type.csv with 300 rows (repeating types)
function generateTypes() {
  const types = [
    { code: 'APARTMENT', name: 'Apartment' },
    { code: 'CONDO', name: 'Condominium' },
    { code: 'HOUSE', name: 'House' },
    { code: 'VILLA', name: 'Villa' },
    { code: 'TOWNHOUSE', name: 'Townhouse' },
    { code: 'LAND', name: 'Land' },
    { code: 'COMMERCIAL', name: 'Commercial' },
    { code: 'INDUSTRIAL', name: 'Industrial' },
    { code: 'OFFICE', name: 'Office' },
    { code: 'WAREHOUSE', name: 'Warehouse' }
  ];

  let csv = 'code,name\n';
  for (let i = 0; i < 300; i++) {
    const type = types[i % types.length];
    const suffix = Math.floor(i / types.length);
    const code = suffix > 0 ? `${type.code}_${suffix + 1}` : type.code;
    const name = suffix > 0 ? `${type.name} ${suffix + 1}` : type.name;
    csv += `${code},${name}\n`;
  }
  fs.writeFileSync(path.join(__dirname, '../mockup-data/ms_properties_type.csv'), csv);
  console.log('✅ Generated ms_properties_type.csv with 300 rows');
}

// Generate ms_address.csv with 300 rows
function generateAddresses() {
  const cityCodes = [];
  // Read city codes from ms_city.csv
  const cityCsv = fs.readFileSync(path.join(__dirname, '../mockup-data/ms_city.csv'), 'utf-8');
  const cityLines = cityCsv.split('\n').slice(1).filter(line => line.trim());
  cityLines.forEach(line => {
    const [code] = line.split(',');
    if (code) cityCodes.push(code);
  });

  const streets = [
    'Sukhumvit Road', 'Silom Road', 'Ratchadamri Road', 'Phetchaburi Road',
    'Rama IV Road', 'Charoen Krung Road', 'Sathon Road', 'Wireless Road',
    'Nimmanhaemin Road', 'Patong Beach Road', 'Beach Road', 'Petchkasem Road',
    'Mittraphap Road', 'Nittayo Road', 'Niphat Uthit Road', 'Phetkasem Road',
    'Thanon Phahonyothin', 'Thanon Ratchadaphisek', 'Thanon Lat Phrao',
    'Thanon Ramkhamhaeng', 'Thanon Srinagarindra', 'Thanon Sukhumvit',
    'Thanon Charoen Nakhon', 'Thanon Ratchaprarop', 'Thanon Phaya Thai'
  ];

  const districts = [
    'Khlong Toei', 'Watthana', 'Mueang Chiang Mai', 'Nimman', 'Kathu',
    'Patong', 'Bang Lamung', 'Hua Hin', 'Mueang Khon Kaen', 'Mueang Udon Thani',
    'Mueang Nakhon Ratchasima', 'Mueang Songkhla', 'Hat Yai', 'Sukhumvit',
    'Sathon', 'Bang Rak', 'Pathum Wan', 'Ratchathewi', 'Dusit', 'Phra Nakhon'
  ];

  const subDistricts = [
    'Watthana', 'Khlong Toei', 'Nimman', 'Patong', 'Hua Hin',
    'Mueang Khon Kaen', 'Mueang Udon Thani', 'Mueang Nakhon Ratchasima',
    'Mueang Songkhla', 'Hat Yai', 'Sukhumvit', 'Sathon', 'Bang Rak',
    'Pathum Wan', 'Ratchathewi', 'Dusit', 'Phra Nakhon', 'Bang Kapi',
    'Lat Phrao', 'Wang Thonglang'
  ];

  let csv = 'address,cityCode,district,subDistrict,postalCode,latitude,longitude\n';
  for (let i = 0; i < 300; i++) {
    const cityCode = cityCodes[i % cityCodes.length];
    const street = streets[i % streets.length];
    const streetNum = (i + 1) * 10;
    const address = `${streetNum} ${street}`;
    const district = districts[i % districts.length];
    const subDistrict = subDistricts[i % subDistricts.length];
    const postalCode = 10000 + (i % 1000);
    const latitude = 13.0 + (i % 100) * 0.01;
    const longitude = 100.0 + (i % 100) * 0.01;
    csv += `${address},${cityCode},${district},${subDistrict},${postalCode},${latitude.toFixed(4)},${longitude.toFixed(4)}\n`;
  }
  fs.writeFileSync(path.join(__dirname, '../mockup-data/ms_address.csv'), csv);
  console.log('✅ Generated ms_address.csv with 300 rows');
}

// Run all generators
console.log('🚀 Generating mockup data files...\n');
generateCities();
generateStatuses();
generateTypes();
generateAddresses();
console.log('\n✅ All mockup data files generated successfully!');
