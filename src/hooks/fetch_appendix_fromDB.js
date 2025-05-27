import { supabase } from "../services/supabaseClient";


export async function fetchAppendixFromDB(col) {
  const { data, error } = await supabase
    .from("appendix_df")
    .select(col)
    .neq(col, null)

    // console.log(data);
        
    return {
        data,
        error
    }
}