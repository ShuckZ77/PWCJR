function heatFormatter(cell, formatterParams) {
  const val = Number(cell.getValue()) || 0;
  const min = formatterParams.minValue ?? 0;
  const max = formatterParams.maxValue ?? 10; // adjust or compute
  // clamp & normalize
  const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
  // hue: 120° = green → 0° = red
  const hue = 120 - 120 * pct;
  cell.getElement().style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
  return val;
}

function absentFormatter(cell) {
  const val = cell.getValue()?.toUpperCase() || "A";

  if (val == "A") {
    cell.getElement().style.backgroundColor = `#ff758f`;
  }

  return val;
}

export const columnsDef = [
  {
    title: "unique_id",
    field: "unique_id",
  },
  {
    title: "class_date",
    field: "class_date",
    // sorter: "string",
    headerFilter: true,
  },
  {
    title: "date",
    field: "date",
    visible: true,
    // sorter: "string",
  },
  {
    title: "day",
    field: "day",
    sorter: "string",
  },
  {
    title: "month",
    field: "month",
    // sorter: "string",
  },
  {
    title: "year",
    field: "year",
    // sorter: "string",
  },
  {
    title: "userid",
    field: "userid",
    // sorter: "string",
  },
  {
    title: "batchid",
    field: "batchid",
    // sorter: "string",
  },
  {
    title: "roomid",
    field: "roomid",
    // sorter: "string",
  },
  {
    title: "usercount",
    field: "usercount",
    // sorter: "string",
  },
  {
    title: "mentor_name",
    field: "mentor_name",
    sorter: "string",
    headerFilter: true,
  },
  {
    title: "mentor_pwid",
    field: "mentor_pwid",
    sorter: "string",
    headerFilter: true,
  },
  {
    title: "mentor_email",
    field: "mentor_email",
    sorter: "string",
    headerFilter: true,
  },
  {
    title: "mentor_phone",
    field: "mentor_phone",
    // sorter: "string",
    headerFilter: true,
  },
  {
    title: "batch_name",
    field: "batch_name",
    sorter: "string",
    headerFilter: true,
  },
  {
    title: "student_name",
    field: "student_name",
    sorter: "string",
    headerFilter: true,
  },
  {
    title: "primarynumber",
    field: "primarynumber",
    // sorter: "string",
  },
  {
    title: "class",
    field: "class",
    // sorter: "string",
    headerFilter: true,
  },
  {
    title: "first_payment_date",
    field: "first_payment_date",
    // sorter: "string",
  },
  {
    title: "e-mandate",
    field: "e-mandate",
    // sorter: "string",
  },
  {
    title: "roll_no",
    field: "roll_no",
    // sorter: "string",
  },
  {
    title: "erp_id",
    field: "erp_id",
    // sorter: "string",
  },
  {
    title: "watchtime_in_minutes",
    field: "watchtime_in_minutes",
    // sorter: "string",
  },
  {
    title: "rating",
    field: "rating",
    // sorter: "string",
  },
  {
    title: "feedback",
    field: "feedback",
    width: 200,
    // sorter: "string",
  },
  {
    title: "attendance",
    field: "attendance",
    headerFilter: true,
    formatter: absentFormatter,
  },
  {
    title: "absent_count",
    field: "absent_count",
    headerFilter: true,
    formatter: heatFormatter,
    formatterParams: {
      minValue: 0,
      maxValue: 5, // pick your expected maximum here!
    },
  },
  {
    title: "call_pickedBy",
    field: "call_pickedBy",
    editor: "list",
    editorParams: {
      values: ["red", "green", "blue", "orange"],
      clearable: true, //show clear "x" button on editor
      sort: "asc", //sort direction for the values list
    },
  },
  {
    title: "disposition",
    field: "disposition",
    editor: "list",
    editorParams: {
      values: ["red", "green", "blue", "orange"],
      clearable: true, //show clear "x" button on editor
      sort: "asc", //sort direction for the values list
    },
  },
];
