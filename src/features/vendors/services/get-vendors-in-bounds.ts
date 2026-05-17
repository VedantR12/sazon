import { supabase } from "@/lib/supabase";
import { Vendor } from "../types/vendor";

type Bounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export async function getVendorsInBounds(
  bounds: Bounds
): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .gte("latitude", bounds.south)
    .lte("latitude", bounds.north)
    .gte("longitude", bounds.west)
    .lte("longitude", bounds.east);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}