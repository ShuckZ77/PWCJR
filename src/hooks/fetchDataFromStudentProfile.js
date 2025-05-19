import { supabase } from "../services/supabaseClient";


export async function studentProfile(user_id) {
  const { data, error } = await supabase
    .from("student_profile")
    .select()
    .eq("user_id", user_id)

    console.log(data);
    
    return {
        data,
        error
    }
}