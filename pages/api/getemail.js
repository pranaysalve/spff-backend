import { createClient } from "@/utils/supabase/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing team member id" });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("email")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  console.log({ data, error });
  res.status(200).json({ email: data.email });
}
