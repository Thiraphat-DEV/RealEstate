import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto';

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
}

@Injectable()
export class PropertiesService {
  private properties: Property[] = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      price: 250000,
      location: 'Bangkok, Thailand'
    },
    {
      id: 2,
      title: 'Luxury Villa with Ocean View',
      price: 1200000,
      location: 'Phuket, Thailand'
    },
    {
      id: 3,
      title: 'Cozy House in Suburb',
      price: 180000,
      location: 'Chiang Mai, Thailand'
    },
    {
      id: 4,
      title: 'Demo in Suburb',
      price: 180000,
      location: 'Chiang Mai, Thailand'
    },
    {
      id: 5,
      title: 'Test in Suburb',
      price: 180000,
      location: 'Chiang Mai, Thailand'
    }
  ];

  findAll(): Property[] {
    return this.properties;
  }

  findOne(id: number): Property {
    const property = this.properties.find((p) => p.id === id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  create(createPropertyDto: CreatePropertyDto): Property {
    const newProperty: Property = {
      id: this.properties.length + 1,
      ...createPropertyDto
    };
    this.properties.push(newProperty);
    return newProperty;
  }
}
