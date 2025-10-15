export type DestinationCountry = 'SWEDEN' | 'CHINA' | 'BRAZIL' | 'AUSTRALIA';

export interface CountryOption {
  code: DestinationCountry;
  name: string;
  multiplier: number;
}

export interface Box {
  id: string;
  receiver_name: string;
  weight: number;
  box_color: string;
  destination_country: DestinationCountry;
  shipping_cost: number;
  created_at: string;
}

export interface BoxFormData {
  receiver_name: string;
  weight: number;
  box_color: string;
  destination_country: DestinationCountry;
}

export interface FormErrors {
  receiver_name?: string;
  weight?: string;
  box_color?: string;
  destination_country?: string;
}
