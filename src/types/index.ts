export type UserRole = 'farmer' | 'buyer' | 'supplier' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  avatar?: string;
  bio?: string;
  farmName?: string;
  verified?: boolean;
  createdAt: string;
}

export type ProductCategory =
  | 'Maize'
  | 'Beans'
  | 'Potatoes'
  | 'Tomatoes'
  | 'Avocados'
  | 'Onions'
  | 'Fruits'
  | 'Vegetables'
  | 'Dairy'
  | 'Poultry'
  | 'Livestock'
  | 'Other';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number; // in KSh
  unit: string; // e.g. "90kg bag", "kg", "crate", "litre", "head"
  quantityAvailable: number;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  image: string;
  status: 'active' | 'sold' | 'rejected';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'M-Pesa' | 'Card' | 'Cash on Delivery';
export type PaymentStatus = 'completed' | 'pending' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    unit: string;
    sellerId: string;
    sellerName: string;
    image: string;
  }>;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionReference?: string;
  mpesaPhoneNumber?: string;
  createdAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  sizeAcres: number;
  soilType: string;
  irrigationType: string;
  primaryCrops: string[];
  notes?: string;
  createdAt: string;
}

export type CropGrowthStage = 'Germination' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvested';
export type CropHealthStatus = 'Healthy' | 'Needs Attention' | 'Treated';

export interface CropRecord {
  id: string;
  farmId: string;
  userId: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  acreage: number;
  stage: CropGrowthStage;
  healthStatus: CropHealthStatus;
  notes?: string;
}

export type AnimalType = 'Dairy Cow' | 'Goat' | 'Poultry' | 'Sheep' | 'Pig' | 'Other';
export type AnimalHealthStatus = 'Vaccinated' | 'Healthy' | 'In Treatment';

export interface LivestockRecord {
  id: string;
  farmId: string;
  userId: string;
  tagNumber: string;
  animalType: AnimalType;
  breed: string;
  count: number;
  birthDate?: string;
  healthStatus: AnimalHealthStatus;
  feedingSchedule: string;
  milkYieldLpd?: number;
  lastVeterinaryCheck: string;
  notes?: string;
}

export type FinancialType = 'income' | 'expense';

export interface FinancialRecord {
  id: string;
  userId: string;
  farmId?: string;
  type: FinancialType;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export type ArticleCategory =
  | 'Crop Production'
  | 'Livestock Management'
  | 'Soil & Water'
  | 'Pest & Disease'
  | 'Climate-Smart'
  | 'Agri-Tech & Business';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  authorId: string;
  authorName: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  featured?: boolean;
  tags: string[];
  imageUrl?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  content: string;
  relatedProductId?: string;
  productTitle?: string;
  timestamp: string;
  read: boolean;
}

export interface WeatherData {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  dailyForecast: Array<{
    date: string;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    precipitationProb: number;
    weatherCode: number;
    description: string;
  }>;
  farmingAdvisories: string[];
}
