import dayjs from "dayjs";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
// import { setTableInstance, getTableInstance } from "../../utils/TableManager";
import { columnsDef } from "../../helpers/columns_def";
import { calculatedAbsentCount } from "../../helpers/calculatedAbsentCount";
// import { usePaginatedSupabaseTable } from "../../hooks/usePaginatedSupabaseTable";
import { fetchRowsFromDB } from "../../hooks/fetchRowsFromDB";
import { headerFormatter } from "../../helpers/header_formatting";
import DateRangeSelect from "./DateRangeSelect";
import { supabase } from "../../services/supabaseClient";
import StudentProfileModal from "./StudentProfileModal";
import "./DataTable.css";


const PAGE_SIZE = 1000;

function DataTableNew() {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null); // We store the Tabulator instance here
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState(
    dayjs().subtract(7, "d")
  );
  const [dateRangeEnd, setDateRangeEnd] = useState(dayjs().subtract(2, "d"));
  const [currPage, setCurrPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);


  async function loadRows(START, END, replace = false) {
    console.log("Load Rows Function Runs");

    if (tabulatorInstance.current) {
      setCurrPage(tabulatorInstance.current.getPage());
    }

    setLoading(true);
    const { processedTableData, rowsFetchedLength, error } =
      await fetchRowsFromDB(
        START,
        END,
        null,
        dateRangeStart.format("YYYY-MM-DD"),
        dateRangeEnd.format("YYYY-MM-DD")
      );

    if (error) {
      alert("Failed to load data: " + error.message);
      setLoading(false);
      return;
    }

    setTableData((prev) => {
      return replace
        ? calculatedAbsentCount([...processedTableData])
        : calculatedAbsentCount([...prev, ...processedTableData]);
    });

    setHasMore(PAGE_SIZE === rowsFetchedLength);
    setLoading(false);
  }

  function onNewSearch() {
    loadRows(0, PAGE_SIZE - 1, true); // 'true' means replace old data!
  }

  async function loadMoreRowsOnClick() {
    loadRows(tableData.length, tableData.length + PAGE_SIZE - 1, false);
  }

  async function updateData(row) {
    const response = await supabase
      .from("attendance_mmi")
      .update({
        call_pickedBy: row.call_pickedBy || null,
        disposition: row.disposition || null,
        commencement: row.commencement || null,
      })
      .eq("batch_id", row.batch_id)
      .eq("user_id", row.user_id)
      .eq("class_date", row.class_date)
      .select();

    console.log(response);
  }

  // ==== INITAL LOADING OF TABLE ====
  // useEffect(() => {11
  //   loadRows(0, PAGE_SIZE - 1);
  // }, []);

  // ==== SETTING UP TABULATOR EVERYTIME TABLEDATA CHANGES ====
  useEffect(() => {
    if (tableRef.current) {
      // Remove old table if it exists
      if (tabulatorInstance.current) {
        tabulatorInstance.current.destroy();
      }

      // Create new Tabulator table
      tabulatorInstance.current = new Tabulator(tableRef.current, {
        height: "100%",
        layout: "fitDataStretch",
        pagination: true,
        paginationOutOfRange: "last",
        data: tableData,
        columns: columnsDef,
        paginationCounter: "rows",
        groupStartOpen: false,
        placeholder: "No Data Available",
        dependencies: {
          DateTime: DateTime,
        },
      });
    }

    tabulatorInstance.current.on("tableBuilt", () => {
      console.log("Table has been built!");
      tabulatorInstance.current.setGroupBy("student_name");
      headerFormatter(tabulatorInstance);
      tabulatorInstance.current.setPage(currPage);
      tabulatorInstance.current.hideColumn("batch_id");
      // tabulatorInstance.current.hideColumn("user_id");
      tabulatorInstance.current.hideColumn("room_id");
      tabulatorInstance.current.hideColumn("mentor_pwid");
      tabulatorInstance.current.hideColumn("mentor_email");
      tabulatorInstance.current.hideColumn("mentor_phone");
      tabulatorInstance.current.hideColumn("e_mandate");
      tabulatorInstance.current.hideColumn("roll_no");
      tabulatorInstance.current.hideColumn("erp_id");
      tabulatorInstance.current.hideColumn("date_range");
      tabulatorInstance.current.hideColumn("date_span");
    });

    tabulatorInstance.current.on("cellEdited", function (cell) {
      //cell - cell component
      const row = cell.getRow().getData();
      console.log("Cell Edited", row);
      updateData(row);
    });

    tabulatorInstance.current.on("groupClick", async function (e, group) {
      //e - the click event object
      //group - group component
      console.log("Group header Clicked");
      setSelectedUserId(group.getRows()[0].getData().user_id);
      setModalOpen(true);
    });

    // tabulatorInstance.current.on("pageLoaded", function (pageno) {
    //   //pageno - the number of the loaded page
    //   console.log(pageno);
    //   setPagination(pageno)
    // });

    // Clean up when the component is removed
    return () => {
      if (tabulatorInstance.current) {
        tabulatorInstance.current.destroy();
        tabulatorInstance.current = null;
      }
    };
  }, [tableData]);


  return (
    <>
      <DateRangeSelect
        dateRangeStart={dateRangeStart}
        dateRangeEnd={dateRangeEnd}
        setDateRangeStart={setDateRangeStart}
        setDateRangeEnd={setDateRangeEnd}
        loadRows={onNewSearch}
        PAGE_SIZE={PAGE_SIZE}
        hasMore={hasMore}
        loadMoreRowsOnClick={loadMoreRowsOnClick}
        loading={loading}
      />

      <StudentProfileModal
        userId={selectedUserId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="table-container">
        <div ref={tableRef}></div>
      </div>
    </>
  );
}

export default DataTableNew;
