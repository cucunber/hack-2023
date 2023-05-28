export interface IHall {
  id: number;
  name: string;
  descriptions: string;
  owner: number;
  hall_type: number[];
  view_count: number;
  area_min: string;
  area: string;
  capacity_min: number;
  capacity: number;
  rating: number;
  address: string;
  price_min: number;
  price: number;
  unit: number;
  email: string;
  longitude: string;
  latitude: string;
  condition: string[];
  phone: string;
  site: string;
  vk: string;
  telegram: string;
  whatsapp: string;
  properties: string;
  services: Record<string, any>;
  approved_order_date: string;
  avatar: IFile;
  media: IFile[];
  event_type: string;
  recommendations: string;
  comments: string;
  moderated: number;
}

export interface IHallType {
  id: number;
  type_name: string;
}

export interface Limits {
  min_area: number;
  max_area: number;
  min_capacity: number;
  max_capacity: number;
  min_price: number;
  max_price: number;
}

export interface IFile {
  id: number;
  hall: number;
  file: string;
  is_avatar: boolean;
}
