export type Database = {
  public: {
    Tables: {
      boxes: {
        Row: {
          id: string;
          receiver_name: string;
          weight: number;
          box_color: string;
          destination_country: 'SWEDEN' | 'CHINA' | 'BRAZIL' | 'AUSTRALIA';
          shipping_cost: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          receiver_name: string;
          weight: number;
          box_color: string;
          destination_country: 'SWEDEN' | 'CHINA' | 'BRAZIL' | 'AUSTRALIA';
          shipping_cost: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          receiver_name?: string;
          weight?: number;
          box_color?: string;
          destination_country?: 'SWEDEN' | 'CHINA' | 'BRAZIL' | 'AUSTRALIA';
          shipping_cost?: number;
          created_at?: string;
        };
      };
    };
  };
};
