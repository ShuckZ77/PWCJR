// TableManager.js
let tabulatorInstance = null;

// console.log(tabulatorInstance);

/**
 * Store the Tabulator instance.
 * @param {Tabulator} instance
 */
export function setTableInstance(instance) {
  tabulatorInstance = instance;
}

/**
 * Retrieve the stored Tabulator instance.
 * @returns {Tabulator|null}
 */
export function getTableInstance() {
  return tabulatorInstance;
}
