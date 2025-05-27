import { fetchAppendixFromDB } from "../hooks/fetch_appendix_fromDB";

const call_pickedby_values = (await fetchAppendixFromDB('call_pickedby')).data.map(e=>e.call_pickedby) || [];
const dispositon_values = (await fetchAppendixFromDB('disposition')).data.map(e=>e.disposition) || [];

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
    title: "class_date",
    field: "class_date",
    sorter: "date",
    sorterParams: {
      format: "yyyy-MM-dd",
      alignEmptyValues: "top",
    },
    headerFilter: true,
    frozen: true,
  },
  {
    title: "primary_number",
    field: "primary_number",
    sorter: "string",
    headerFilter: true,
  },
  {
    title: "attendance_status",
    field: "attendance_status",
    headerFilter: true,
    formatter: absentFormatter,
  },
  {
    title: "faculty_name",
    field: "faculty_name",
    headerFilter: true,
  },
  {
    title: "Absent Count",
    field: "countA",
    headerFilter: "number",
    formatter: heatFormatter,
    headerFilterFunc: ">=",
    formatterParams: {
      minValue: 0,
      maxValue: 5, // pick your expected maximum here!
    },
  },
  {
    title: "batch_id",
    field: "batch_id",
    // sorter: "string",
  },
  {
    title: "user_id",
    field: "user_id",
    // sorter: "string",
  },
  {
    title: "room_id",
    field: "room_id",
    // sorter: "string",
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
    title: "student_class",
    field: "student_class",
    // sorter: "string",
    headerFilter: true,
  },
  {
    title: "attendance_span",
    field: "attendance_span",
    // sorter: "string",
  },
  {
    title: "days_span",
    field: "days_span",
    // sorter: "string",
  },
  {
    title: "watchtime_in_minutes",
    field: "watchtime_in_minutes",
    sorter: "number",
    headerFilter: true,
  },
  {
    title: "rating",
    field: "rating",
    headerFilter: true,
    sorter: "number",
    // formatter: "star",
  },
  {
    title: "feedback",
    field: "feedback",
    width: 200,
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
    title: "user_count",
    field: "user_count",
    sorter: "number",
    headerFilter: true,
  },
  {
    title: "first_class_attended",
    field: "first_class_attended",
    sorter: "datetime",
    headerFilter: true,
  },
  {
    title: "last_class_attended",
    field: "last_class_attended",
    sorter: "datetime",
    headerFilter: true,
  },
  {
    title: "call_pickedby",
    field: "call_pickedby",
    editor: "list",
    editorParams: {
      values: call_pickedby_values || [],
      clearable: true, //show clear "x" button on editor
      sort: "asc", //sort direction for the values list
    },
  },
  {
    title: "non_attending_reason",
    field: "disposition",
    editor: "list",
    editorParams: {
      values: dispositon_values || [],
      clearable: true, //show clear "x" button on editor
      sort: "asc", //sort direction for the values list
    },
  },
  {
    title: "commencement",
    field: "commencement",
    editor: "date",
    format: "yyyy-MM-dd",
  },
];
