import { createClient } from "@/utils/supabase/server";
export async function GetAllInvestors() {
  const supabase = await createClient();

  const { data: investors, error } = await supabase
    .from("AllInvestorsView")
    .select(`*`)
    .range(0, 1000);

  if (error) throw error;

  return data;
}
