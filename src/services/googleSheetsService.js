// src/services/googleSheetsService.js

/**
 * Fetch a page of rows from your GAS proxy.
 *
 * @param {string} webAppUrl  Your deployed GAS Web App URL
 * @param {number} page       1-based page index
 * @param {number} size       Number of rows per page
 * @param {string} email      Optional mentor_email to filter by
 */
export async function fetchPageData(
  webAppUrl,
  page = 1,
  size = 50,
  email = ""
) {

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (email) params.set("email", email.trim().toLowerCase());

  const res = await fetch(`${webAppUrl}?${params.toString()}`);
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.message || "GAS returned an error");
  }
  return {
    data: json.data,
    totalPages: json.totalPages,
    currentPage: json.currentPage,
  };
}

export async function updateRow(webAppUrl, rowNumber, updatedValues) {
  const res = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowNumber, updatedValues }),
  });
  const json = await res.json();
  if (json.status !== "success") {
    throw new Error(json.message || "Failed to update row");
  }
  return json;
}
