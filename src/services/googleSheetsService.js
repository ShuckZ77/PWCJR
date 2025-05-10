export async function fetchPageData(webAppUrl, page = 1, size = 25) {
  const response = await fetch(`${webAppUrl}?page=${page}&size=${size}`);
  const json = await response.json();
  if (json.status === "success") {
    return {
      data: json.data,
      totalPages: json.totalPages,
      currentPage: json.currentPage,
    };
  } else {
    throw new Error(json.message || "Failed to fetch data");
  }
}

export async function updateRow(webAppUrl, rowNumber, updatedValues) {
  const response = await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowNumber, updatedValues }),
  });
  const json = await response.json();
  if (json.status !== "success") {
    throw new Error(json.message || "Failed to update row");
  }
  return json;
}
