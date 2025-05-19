import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function StudentProfileCard({ data }) {
  // console.log(data);
  if (!data) return null;

  // Helper to display label + value or 'N/A' if missing
  const InfoRow = ({ label, value }) => (
    <Box mb={0.7}>
      <Typography variant="subtitle2" color="textSecondary" component="span">
        {label}:{" "}
      </Typography>
      <Typography
        variant="body1"
        component="span"
        sx={{
          fontWeight: value ? "normal" : "light",
          color: value ? "text.primary" : "gray",
        }}
      >
        {value ?? "N/A"}
      </Typography>
    </Box>
  );

  return (
    <Card
      sx={{
        maxWidth: "80vw", // max 90% of viewport width (wider)
        maxHeight: "50vh", // max 80% of viewport height (limit height)
        margin: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          overflowY: "auto", // scroll if content too tall
          paddingRight: 1, // add some padding for scrollbar space
        }}
      >
        <Typography variant="h5" gutterBottom>
          {data.name}
        </Typography>

        {/* Personal Info */}
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoRow label="Class" value={data.class} />
            <InfoRow label="Board" value={data.board} />
            <InfoRow label="Language" value={data.language} />
            <InfoRow label="Date of Birth" value={data.dob} />
            <InfoRow
              label="Curriculum Mapping Done"
              value={data.curriculum_mapping_done ? "Yes" : "No"}
            />
            <InfoRow
              label="Next Mid Term Exam"
              value={data.next_mid_term_exam}
            />
          </Grid>

          <Grid item xs={6}>
            <InfoRow label="School" value={data.school_name} />
            <InfoRow label="School Timing" value={data.school_timing} />
            <InfoRow label="Wifi Available" value={data.wifi ? "Yes" : "No"} />
            <InfoRow label="Device OS" value={data.device_os} />
            <InfoRow label="Device Type" value={data.device_type} />
          </Grid>
        </Grid>

        {/* Contact Info */}
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoRow label="Primary Number" value={data.primary_number} />

            <InfoRow label="Access Number" value={data.access_number} />
            <InfoRow label="Alternate Number" value={data.alternate_number} />
            <InfoRow label="City" value={data.city} />
            <InfoRow label="State" value={data.state} />
            <InfoRow label="Pin Code" value={data.pin_code} />
          </Grid>
        </Grid>

        {/* Parents Info */}
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Parents Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoRow label="Father's Name" value={data.father_name} />
            <InfoRow
              label="Father's Occupation"
              value={data.father_occupation}
            />
            <InfoRow label="Father's Number" value={data.father_number} />
          </Grid>
          <Grid item xs={6}>
            <InfoRow label="Mother's Name" value={data.mother_name} />
            <InfoRow
              label="Mother's Occupation"
              value={data.mother_occupation}
            />
            <InfoRow label="Mother's Number" value={data.mother_number} />
          </Grid>
          <Grid item xs={12}>
            <InfoRow
              label="Parents' Expectations"
              value={data.parents_expectations}
            />
            <InfoRow label="Sibling Grade" value={data.sibling_grade} />
          </Grid>
        </Grid>

        {/* Academic Marks */}
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Academic Marks
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InfoRow label="English" value={data.eng_mark} />
            <InfoRow label="Math" value={data.math_mark} />
            <InfoRow label="Science" value={data.science_mark} />
          </Grid>
          <Grid item xs={6}>
            <InfoRow label="EVS" value={data.evs_mark} />
            <InfoRow label="SST" value={data.sst_mark} />
            <InfoRow
              label="Last Year Total Marks"
              value={data.last_year_total_marks}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StudentProfileCard;
