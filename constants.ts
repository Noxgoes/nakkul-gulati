
import { Place } from './types';

export const CATEGORIES: string[] = ['All', 'Restaurants', 'Cafes', 'Parks', 'Museums', 'Shops'];

export const INITIAL_PLACES: Place[] = [
  {
    name: "The Daily Grind",
    rating: 5.0,
    description: "A cozy spot for artisanal coffee & pastries.",
    address: "123 Coffee St, 0.5 mi",
    categoryTag: "Café",
  },
  {
    name: "Bistro Éclair",
    rating: 4.5,
    description: "Modern French cuisine with outdoor seating.",
    address: "456 Patiserie Ave, 1.2 mi",
    categoryTag: "Food",
  },
  {
    name: "City Books",
    rating: 5.0,
    description: "An independent bookstore with a reading nook.",
    address: "101 Wine Rd, Ln, 0.7 mi",
    categoryTag: "Books",
  },
    {
    name: "Vinoteca",
    rating: 4.8,
    description: "Wine bar with curated selection & tapas.",
    address: "789 Vineyard Blvd, 2.1 mi",
    categoryTag: "Wine",
  },
];