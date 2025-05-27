import dayjs from "dayjs";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import "./DataTable.css";
// import { setTableInstance, getTableInstance } from "../../utils/TableManager";
import { columnsDef } from "../../helpers/columns_def"
import { calculatedAbsentCount } from "../../helpers/calculatedAbsentCount";
// import { usePaginatedSupabaseTable } from "../../hooks/usePaginatedSupabaseTable";
import { fetchRowsFromDB } from "../../hooks/fetchRowsFromDB";
import { headerFormatter } from "../../helpers/header_formatting";
import DateRangeSelect from "./DateRangeSelect";
import { supabase } from "../../services/supabaseClient";
import StudentProfileModal from "./StudentProfileModal";
import { useAuth } from "../../context/AuthContext";
import { fetchAppendixFromDB } from "../../hooks/fetch_appendix_fromDB";

const PAGE_SIZE = 1500;

function DataTableNew() {
  let { user, authChecked } = useAuth();
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

  const [columnDefintion, setColumnDefinition] =  useState(columnsDef());

  async function setColumnDef(){
    const callPickedByValues = (await fetchAppendixFromDB("call_pickedby")).data.map((e) => e.call_pickedby);
    const dispositionValues = (await fetchAppendixFromDB("disposition")).data.map((e) => e.disposition);
    setColumnDefinition(columnsDef(callPickedByValues, dispositionValues));
  }

  async function loadRows(START, END, replace = false) {
    const temp = ["rishish.shukla@pw.live", "payalphartiyal@pw.live", "ravi.prakash1@pw.live", "ateeb.yusuf@pw.live", "sumit.jadaun@pw.live", "shristy.katiyar@pw.live"]

    if(temp.includes(user.email)){
      user.email = null
    }

    await setColumnDef();
    console.log("Load Rows Function Runs");

    if (tabulatorInstance.current) {
      setCurrPage(tabulatorInstance.current.getPage());
    }

    setLoading(true); //user.email
    const { processedTableData, rowsFetchedLength, error } =
      await fetchRowsFromDB(
        START,
        END,
        user.email,
        dateRangeStart.format("YYYY-MM-DD"),
        dateRangeEnd.format("YYYY-MM-DD")
      );

      // console.log(processedTableData)

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
      .from("combined_df")
      .update({
        call_pickedby: row.call_pickedby || null,
        disposition: row.disposition || null,
        commencement: row.commencement || null,
      })
      .eq("batch_id", row.batch_id)
      .eq("user_id", row.user_id)
      .eq("room_id", row.room_id)
      .eq("class_date", row.class_date)
      .select();

    // console.log(response);
  }

  // ==== INITAL LOADING OF TABLE ====
  // useEffect(() => {11
    
  //   setColumnDef();
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
        columns: columnDefintion,
        paginationCounter: "rows",
        groupStartOpen: false,
        placeholder: "No Data Set",
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
      tabulatorInstance.current.hideColumn("user_id");
      tabulatorInstance.current.hideColumn("room_id");
      tabulatorInstance.current.hideColumn("batch_name");
      tabulatorInstance.current.hideColumn("student_name");
      tabulatorInstance.current.hideColumn("class");
      tabulatorInstance.current.hideColumn("mentor_pwid");
      // tabulatorInstance.current.hideColumn("mentor_email");
      tabulatorInstance.current.hideColumn("mentor_phone");
      tabulatorInstance.current.hideColumn("days_span");
      tabulatorInstance.current.hideColumn("attendance_span");
      tabulatorInstance.current.setSort("class_date", "desc");;
    });

    tabulatorInstance.current.on("cellEdited", function (cell) {
      //cell - cell component
      const row = cell.getRow().getData();
      // console.log("Cell Edited", row);
      updateData(row);
    });

    // tabulatorInstance.current.on("groupClick", async function (e, group) {
    //   //e - the click event object
    //   //group - group component
    //   console.log("Group header Clicked");
    //   setSelectedUserId(group.getRows()[0].getData().user_id);
    //   setModalOpen(true);
    // });

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
