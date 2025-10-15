import { supabase } from '../lib/supabase';
import type { Box, BoxFormData } from '../types';
import { calculateShippingCost } from './shippingService';

export const saveBox = async (formData: BoxFormData): Promise<Box> => {
  const shipping_cost = calculateShippingCost(
    formData.weight,
    formData.destination_country
  );

  const { data, error } = await supabase
    .from('boxes')
    .insert({
      receiver_name: formData.receiver_name.trim(),
      weight: formData.weight,
      box_color: formData.box_color,
      destination_country: formData.destination_country,
      shipping_cost,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save box: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from insert');
  }

  return data;
};

export const fetchBoxes = async (): Promise<Box[]> => {
  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch boxes: ${error.message}`);
  }

  return data || [];
};
