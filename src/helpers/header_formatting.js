export function headerFormatter(tableInstance) {
  return tableInstance.current.setGroupHeader(function (
    value,
    count,
    data,
    group
  ) {
    //value - the value all members of this group share
    //count - the number of rows in this group
    //data - an array of all the row data objects in this group
    //group - the group component for the group

    let aggregrateWTM = 0;
    let aggregrateRatings = 0;
    let ratingCount = 0;
    let presentCount = data.length - data[0].countA;

    for (let row of data) {
      if (row.attendance_status == "P") {
        aggregrateWTM += row.watchtime_in_minutes;
      }
      if (row.rating && row.attendance_status == "P") {
        aggregrateRatings += row.rating;
        ratingCount++;
      }
    }
    // console.log(group);

    const groudHeadline = `
      <span style="color: #003366; padding: 4px 8px; border-radius: 4px;">
        ${value} (${data[0].primary_number})  
        |
        G${data[0].class}
        | 
        Absent = ${data[0].countA}
        |
        Avg. WTM = ${
          presentCount != 0 ? Math.ceil(aggregrateWTM / presentCount) : 0
        }
        | 
        Avg. Rating = ${
          ratingCount != 0 ? Math.ceil(aggregrateRatings / ratingCount) : 0
        }
        
      </span>      
      `;

    return groudHeadline;
  });
}
