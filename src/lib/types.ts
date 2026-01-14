export type User = {
  uid: string;
  name: string;
  email: string;
};

export type Admin = {
  uid: string;
  name: string;
  email: string;
};

export type Bike = {
  bikeId: string;
  status: 'available' | 'rented' | 'locked';
  station: string;
};

export type Rental = {
  rentalId: string;
  bikeId: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  price: number | null;
};
