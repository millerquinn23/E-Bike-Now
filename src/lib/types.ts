import { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  name: string;
  email: string;
};

export type Admin = {
  uid:string;
  name: string;
  email: string;
};

export type Bike = {
  id: string;
  status: 'available' | 'rented' | 'locked';
  station: string;
};

export type Rental = {
  id: string;
  bikeId: string;
  userId: string;
  startTime: Timestamp;
  endTime: Timestamp | null;
  price: number | null;
};
