import { supabase } from "../services/supabaseClient";
import { calculatedAbsentCount } from "../helpers/calculatedAbsentCount";

export async function fetchRowsFromDB(
  START,
  END,
  MENTOR_EMAIL = null,
  START_DATE = null,
  END_DATE = null
) {
  if (MENTOR_EMAIL) {
    const { data, error } = await supabase
      .from("combined_df")
      .select("*")
      .eq("mentor_email", MENTOR_EMAIL)
      .gte("class_date", START_DATE)
      .lte("class_date", END_DATE)
      // .order("class_date", { ascending: true }) // <-- explicit ordering by date
      .order("user_id", { ascending: true }) // <-- secondary ordering by user
      .range(START, END);

    console.log(data);

    const processedTableData = calculatedAbsentCount(data) || [];

    return {
      processedTableData,
      error,
      rowsFetchedLength: processedTableData.length,
    };
  } else {
    const { data, error } = await supabase
      .from("combined_df")
      .select("*")
      .gte("class_date", START_DATE)
      .lte("class_date", END_DATE)
      // .order("class_date", { ascending: true }) // <-- explicit ordering by date
      .order("user_id", { ascending: true }) // <-- secondary ordering by user
      .range(START, END);

    const processedTableData = calculatedAbsentCount(data) || [];

    return {
      processedTableData,
      error,
      rowsFetchedLength: processedTableData.length,
    };
  }
}
