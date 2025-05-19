// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import Button from "@mui/material/Button";


// function DateRangeSelect(props) {
//   return (
//     <div className="container mx-0 mt-4">
//       <div className="row ">
//         <div className="col-12">
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <span className="m-1">
//               <DatePicker
//                 label="Start Date"
//                 value={props.dateRangeStart}
//                 onChange={(newValue) => props.setDateRangeStart(newValue)}
//               />
//             </span>

//             <span className="m-1">
//               <DatePicker
//                 label="End Date"
//                 value={props.dateRangeEnd}
//                 onChange={(newValue) => props.setDateRangeEnd(newValue)}
//               />
//             </span>
//           </LocalizationProvider>

//           <span className="m-1 p-1">
//             <Button
//               variant="contained"
//               disabled={props.loading}
//               onClick={() => props.loadRows(0, props.PAGE_SIZE - 1)}
//             >
//               Load Data
//             </Button>
//           </span>

//           <span className="m-1 p-1">
//             <Button
//               variant="contained"
//               disabled={props.loading || !props.hasMore}
//               onClick={props.loadMoreRowsOnClick}
//             >
//               Fetch More Rows
//             </Button>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DateRangeSelect;


import { useMemo } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import isSameOrBefore  from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

function DateRangeSelect({
  dateRangeStart,
  dateRangeEnd,
  setDateRangeStart,
  setDateRangeEnd,
  loadRows,
  loadMoreRowsOnClick,
  loading,
  hasMore,
  PAGE_SIZE,
}) {
  // Validation: Ensure start date is before or equal to end date
  const isValidDateRange = useMemo(() => {
    if (!dateRangeStart || !dateRangeEnd) return false;
    return dayjs(dateRangeStart).isSameOrBefore(dayjs(dateRangeEnd), "day");
  }, [dateRangeStart, dateRangeEnd]);

  // Disable load data button if loading or invalid date range
  const loadDataDisabled = loading || !isValidDateRange;

  // Disable load more button if loading or no more data
  const loadMoreDisabled = loading || !hasMore;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ m: 2, flexWrap: "wrap" }}
      >
        <DatePicker
          label="Start Date"
          value={dateRangeStart}
          onChange={(newValue) => setDateRangeStart(newValue)}
          maxDate={dateRangeEnd || undefined}
          slotProps={{
            textField: { size: "small", sx: { minWidth: 150 } },
          }}
        />
        <DatePicker
          label="End Date"
          value={dateRangeEnd}
          onChange={(newValue) => setDateRangeEnd(newValue)}
          minDate={dateRangeStart || undefined}
          slotProps={{
            textField: { size: "small", sx: { minWidth: 150 } },
          }}
        />

        <Button
          variant="contained"
          disabled={loadDataDisabled}
          onClick={() => loadRows(0, PAGE_SIZE - 1)}
        >
          {loading ? "Loading..." : "Load Data"}
        </Button>

        <Button
          variant="outlined"
          disabled={loadMoreDisabled}
          onClick={loadMoreRowsOnClick}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      </Stack>

      {!isValidDateRange && (
        <Typography color="error" variant="caption">
          Start Date must be before or equal to End Date
        </Typography>
      )}
    </LocalizationProvider>
  );
}

export default DateRangeSelect;
