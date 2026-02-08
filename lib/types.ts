export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  foodType: 'veg' | 'non-veg' | 'vegan';
  image: string;
  branch: string[];
  isSpecial: boolean;
  available: boolean;
  rating: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  features: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  openHours: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  branch: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  paymentMethod: 'cash' | 'card' | 'upi';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
}

export interface TableBooking {
  id: string;
  userId: string;
  branch: string;
  date: Date;
  time: string;
  guests: number;
  name: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  branch: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
