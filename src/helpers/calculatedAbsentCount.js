export function calculatedAbsentCount(data) {
  const absentCount = {};

  data.forEach((row) => {
    let key = `${row.batch_id}_${row.user_id}`;
    if (row.attendance_status == "A") {
      absentCount[key] = (absentCount[key] || 0) + 1;
    }
  });

  const modifiedData = data.map((row) => {
    let key = `${row.batch_id}_${row.user_id}`;
    if (absentCount[key]) {
      return { ...row, countA: absentCount[key] };
    } else {
      return { ...row, countA: 0 };
    }
  });

  return modifiedData;
}
