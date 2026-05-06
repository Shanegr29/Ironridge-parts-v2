// Auto-generated types matching the Supabase schema
// Re-run `npx supabase gen types typescript` to regenerate from live DB

export type FuelType = 'lpg' | 'gasoline' | 'diesel' | 'electric_lead_acid' | 'electric_lithium'
export type MastType = 'single' | 'two_stage' | 'three_stage' | 'quad' | 'telescopic'
export type TireType = 'cushion' | 'pneumatic' | 'solid_pneumatic' | 'foam_filled'
export type DonorStatus = 'pending_intake' | 'ready_for_teardown' | 'in_teardown' | 'mostly_complete' | 'finished' | 'scrap_only'
export type ConditionGrade = 'A_tested_working' | 'B_takeout_untested' | 'C_for_parts_or_repair' | 'D_core_only'
export type PartStatus = 'pulled_not_listed' | 'listed' | 'sold' | 'shipped' | 'returned' | 'scrapped' | 'reserved'
export type RebuildStatus = 'raw_core' | 'in_rebuild' | 'rebuilt' | 'sold_as_core'
export type ListingChannel = 'ebay' | 'own_site' | 'amazon' | 'facebook_marketplace' | 'walk_in'
export type ListingStatus = 'draft' | 'active' | 'sold' | 'ended_unsold' | 'removed'
export type ShippingMethod = 'calculated' | 'flat_rate' | 'freight' | 'local_pickup_only'
export type OrderStatus = 'paid' | 'ready_to_ship' | 'shipped' | 'delivered' | 'returned' | 'refunded' | 'dispute'
export type CustomerType = 'individual' | 'business'
export type SupplierType = 'auction_house' | 'dealer' | 'end_user' | 'broker' | 'salvage_yard'
export type LocationFacility = 'storage_unit_a' | 'shop' | 'outdoor_yard'
export type LocationType = 'small_parts_bin' | 'shelf' | 'pallet_position' | 'ground'

export interface DonorLift {
  id: string
  make: string
  model: string
  model_family: string | null
  year: number | null
  serial_number: string | null
  hour_meter_reading: number | null
  fuel_type: FuelType | null
  capacity_lbs: number | null
  mast_type: MastType | null
  mast_height_inches: number | null
  attachments: string[]
  tire_type: TireType | null
  acquisition_cost: number
  acquisition_source: string | null
  supplier_id: string | null
  transport_cost: number
  total_cost: number
  intake_date: string
  arrival_condition_notes: string | null
  arrival_photos: string[]
  status: DonorStatus
  intake_completed_by: string | null
  intake_completed_at: string | null
  teardown_started_at: string | null
  teardown_completed_at: string | null
  allocated_cost_total: number
  parts_count: number
  parts_listed_count: number
  parts_sold_count: number
  revenue_to_date: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Part {
  id: string
  donor_lift_id: string
  part_type: string
  part_subtype: string | null
  oem_part_number: string | null
  oem_part_number_alternates: string[]
  description: string | null
  condition_grade: ConditionGrade
  condition_notes: string | null
  weight_lbs: number | null
  dimensions_l_w_h_inches: number[] | null
  cost_basis: number
  asking_price: number | null
  minimum_acceptable_price: number | null
  photos: string[]
  bin_location_id: string | null
  status: PartStatus
  pulled_by: string | null
  pulled_at: string | null
  compatible_models: string[]
  compatible_models_verified: boolean
  is_rebuildable: boolean
  rebuild_status: RebuildStatus | null
  created_at: string
  updated_at: string
}

export interface PartFull extends Part {
  lift_make: string
  lift_model: string
  lift_year: number | null
  lift_serial: string | null
  bin_label: string | null
  bin_facility: LocationFacility | null
}

export interface DonorLiftSummary extends DonorLift {
  gross_profit: number
  margin_pct: number
  parts_unlisted: number
  parts_listed: number
}

export interface Location {
  id: string
  facility: LocationFacility
  zone: string | null
  aisle: string | null
  shelf: string | null
  bin: string | null
  display_label: string | null
  type: LocationType
  max_weight_lbs: number | null
  current_part_count: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  type: CustomerType
  name: string
  business_name: string | null
  email: string | null
  phone: string | null
  shipping_address: Record<string, string> | null
  ebay_user_id: string | null
  ironridge_customer_id: string | null
  total_orders_count: number
  total_spend: number
  first_order_at: string | null
  last_order_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  name: string
  type: SupplierType
  contact_name: string | null
  email: string | null
  phone: string | null
  address: Record<string, string> | null
  total_lifts_purchased: number
  total_spent: number
  average_quality_score: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  part_id: string
  channel: ListingChannel
  channel_listing_id: string | null
  channel_url: string | null
  title: string
  description: string | null
  price: number
  shipping_method: ShippingMethod
  shipping_cost: number | null
  status: ListingStatus
  listed_at: string | null
  ended_at: string | null
  view_count: number
  watcher_count: number
  offer_count: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  channel: ListingChannel
  channel_order_id: string | null
  listing_id: string | null
  part_id: string
  customer_id: string | null
  sale_price: number
  shipping_charged: number
  platform_fees: number
  payment_processing_fees: number
  shipping_cost_actual: number | null
  status: OrderStatus
  ordered_at: string
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  shipping_carrier: string | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Database type for Supabase client generic
export type Database = {
  public: {
    Tables: {
      donor_lift: { Row: DonorLift; Insert: Partial<DonorLift>; Update: Partial<DonorLift> }
      part: { Row: Part; Insert: Partial<Part>; Update: Partial<Part> }
      location: { Row: Location; Insert: Partial<Location>; Update: Partial<Location> }
      customer: { Row: Customer; Insert: Partial<Customer>; Update: Partial<Customer> }
      supplier: { Row: Supplier; Insert: Partial<Supplier>; Update: Partial<Supplier> }
      listing: { Row: Listing; Insert: Partial<Listing>; Update: Partial<Listing> }
      order: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
    }
    Views: {
      part_full: { Row: PartFull }
      donor_lift_summary: { Row: DonorLiftSummary }
      order_full: { Row: Order & { net_to_you: number } }
    }
  }
}
