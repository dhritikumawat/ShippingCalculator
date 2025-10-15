/*
  # Create Shipping Boxes Table

  ## Overview
  Creates a table to store shipping box information for calculating costs from India to various destinations.

  ## New Tables
  
  ### `boxes`
  Stores shipping box information with the following columns:
  - `id` (uuid, primary key) - Unique identifier for each box
  - `receiver_name` (text, required) - Name of the person receiving the box
  - `weight` (numeric, required) - Weight of the box in kilograms (must be positive)
  - `box_color` (text, required) - RGB color value in format "R,G,B"
  - `destination_country` (text, required) - Destination country code (SWEDEN, CHINA, BRAZIL, AUSTRALIA)
  - `shipping_cost` (numeric, required) - Calculated shipping cost in INR
  - `created_at` (timestamptz) - Timestamp when the record was created

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `boxes` table
  - Public read access: Anyone can view all boxes
  - Public insert access: Anyone can add new boxes
  
  ### Policies
  1. **"Anyone can view boxes"** - Allows all users to SELECT from boxes table
  2. **"Anyone can insert boxes"** - Allows all users to INSERT into boxes table

  ## Constraints
  - Weight must be greater than or equal to 0
  - Destination country must be one of: SWEDEN, CHINA, BRAZIL, AUSTRALIA
  - All text fields are trimmed and non-empty

  ## Notes
  - The application calculates shipping costs client-side before saving
  - Color values are stored as comma-separated RGB values (e.g., "255,128,0")
  - This is a public application allowing anonymous submissions
*/

-- Create the boxes table
CREATE TABLE IF NOT EXISTS boxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_name text NOT NULL CHECK (trim(receiver_name) <> ''),
  weight numeric NOT NULL CHECK (weight >= 0),
  box_color text NOT NULL CHECK (trim(box_color) <> ''),
  destination_country text NOT NULL CHECK (destination_country IN ('SWEDEN', 'CHINA', 'BRAZIL', 'AUSTRALIA')),
  shipping_cost numeric NOT NULL CHECK (shipping_cost >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to view all boxes
CREATE POLICY "Anyone can view boxes"
  ON boxes
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert boxes
CREATE POLICY "Anyone can insert boxes"
  ON boxes
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS boxes_created_at_idx ON boxes(created_at DESC);