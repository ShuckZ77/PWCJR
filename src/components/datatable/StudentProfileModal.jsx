import { useEffect, useState } from "react";
import {
  Modal,
  Fade,
  Backdrop,
  Box,
  IconButton,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StudentProfileCard from "./StudentProfileCard";
import { supabase } from "../../services/supabaseClient";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 700,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  overflowY: "auto",
};

export default function StudentProfileModal({ userId, open, onClose }) {
  // console.log({ userId, open, onClose });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!open) {
      setProfileData(null);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      const { data, error } = await supabase
        .from("student_profile")
        .select("*")
        .eq("user_id", userId)
        .single();

      //   console.log(data);

        if (error) {
            console.error("Failed to fetch profile", error);
            setProfileData(null);
        } else {
            setTimeout(() => {
                setProfileData(data);
                setLoading(false);
            }, 1000);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 1 } }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {loading || !profileData ? (
            <>
              <Box>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  sx={{ mt: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  sx={{ mt: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={30}
                  sx={{ mt: 1 }}
                />
              </Box>
            </>
          ) : (
            <StudentProfileCard data={profileData} />
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
