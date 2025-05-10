import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import { setTableInstance, getTableInstance } from "../utils/TableManager";
import { fetchPageData, updateRow } from "../services/googleSheetsService";
import { columnsDef } from "../helpers/columns_def";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyxay9MtJma37qCr6O81ew7uReaQuTA3xCsE_nyW198vC8AP6d2wsYIwguE37q9IEA3/exec";//import.meta.env.VITE_GAS_WEBAPP_URL
const PAGE_SIZE = 50;

export default function DataTable() {
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadPage(page) {
    const table = getTableInstance();

    if (table) {
      table.alert("Please wait, loading data...");
    }
    setLoading(true);

    try {
      const { data, totalPages, currentPage } = await fetchPageData(
        GAS_URL,
        page
      );
      if (table) {
        await table.setData(data);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
      }
    } catch (error) {
      if (table) {
        table.alert("Failed to load data", "error", 3000);
      }
      console.error("Failed to load page:", error);
    } finally {
      setLoading(false);
      if (table) {
        table.clearAlert();
      }
    }
  }

  useEffect(() => {
    // The line let isMounted = true; inside a React useEffect hook is a simple flag used to track whether the component is still mounted when asynchronous operations (like data fetching) complete.
    let isMounted = true;

    async function setupTable() {
      // Fetch first page data before creating table
      if (tableRef.current && !getTableInstance()) {
        const { data, totalPages, currentPage } = await fetchPageData(
          GAS_URL,
          1
        );
        const table = new Tabulator(tableRef.current, {
          index: "unique_id",
          height: "80%",
          layout: "fitDataStretch",
          pagination: false,
          data: data,
          // autoColumns: true,
          columns: columnsDef,
          cellEdited: async (cell) => {
            const rowData = cell.getRow().getData();
            const uniqueId = rowData.unique_id;

            try {
              await updateRow(GAS_URL, uniqueId, rowData);
              // alert("Row updated successfully");
              console.log("Row updated successfully");
            } catch (error) {
              // alert("Failed to update row: " + error.message);
              console.log("Failed to update row: " + error.message);
            }
          },
        });

        setTableInstance(table);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);

        // Waiting for table to get fully built before loading data
        // table.on("tableBuilt", async () => {
        //   if (isMounted) {
        //     table.alert("Please wait, loading data...");
        //     await loadPage(1);
        //   }
        // });

        // if (isMounted) await loadPage(1);
      }
    }

    setupTable();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div style={{ margin: '1rem' }}>
        <div className="alert alert-primary" role="alert">
          A simple primary alert—check it out!
        </div>
        <button
          onClick={() => loadPage(currentPage - 1)}
          disabled={loading || currentPage === 1}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => loadPage(currentPage + 1)}
          disabled={loading || currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div ref={tableRef} style={{margin: '1rem'}}></div>
    </div>
  );
}
