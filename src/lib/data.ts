import type { User, Admin, Bike, Rental } from './types';

export const users: User[] = [
  { uid: 'user-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { uid: 'user-2', name: 'Bob Williams', email: 'bob@example.com' },
  { uid: 'user-3', name: 'Catherine Brown', email: 'catherine@example.com' },
];

export const admins: Admin[] = [
  { uid: 'admin-1', name: 'Charlie Davis', email: 'charlie.davis@ebikenow.com' },
];

export const bikes: Bike[] = [
  { bikeId: 'EN-001', status: 'available', station: 'Central Park South' },
  { bikeId: 'EN-002', status: 'rented', station: 'Times Square' },
  { bikeId: 'EN-003', status: 'available', station: 'Brooklyn Bridge Park' },
  { bikeId: 'EN-004', status: 'locked', station: 'Grand Central Terminal' },
  { bikeId: 'EN-005', status: 'available', station: 'SoHo Boutique' },
  { bikeId: 'EN-006', status: 'available', station: 'Central Park South' },
  { bikeId: 'EN-007', status: 'locked', station: 'Times Square' },
  { bikeId: 'EN-008', status: 'available', station: 'Brooklyn Bridge Park' },
];

export const rentals: Rental[] = [
  { rentalId: 'R-001', bikeId: 'EN-002', userId: 'user-1', startTime: new Date('2024-07-20T10:00:00Z'), endTime: new Date('2024-07-20T10:35:00Z'), price: 12.50 },
  { rentalId: 'R-002', bikeId: 'EN-007', userId: 'user-2', startTime: new Date('2024-07-19T14:00:00Z'), endTime: new Date('2024-07-19T15:15:00Z'), price: 25.00 },
  { rentalId: 'R-003', bikeId: 'EN-001', userId: 'user-1', startTime: new Date('2024-07-18T08:30:00Z'), endTime: new Date('2024-07-18T08:45:00Z'), price: 7.00 },
  { rentalId: 'R-004', bikeId: 'EN-005', userId: 'user-3', startTime: new Date('2024-07-20T12:00:00Z'), endTime: null, price: null },
];
