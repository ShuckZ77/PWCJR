import { AppBar, Toolbar, Button, Box, Typography, Stack, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { use } from "react";

function Navbar() {
  const { user, logout } = useAuth();

  // console.log(useAuth());

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo LEFT, internal navigation with React Router Link */}
        <Box>
          <Link to="PWCJR/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="cjr_images/cjr-white-logo.svg"
              alt="cjr-logo"
              style={{ height: 38 }}
            />
          </Link>
        </Box>
        {/* Logout RIGHT */}
        <Box>
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{ m: 1, flexWrap: "wrap" }}
          >
            <Chip label={user && user.email} color="info" />

            {user && (
              <Button color="inherit" variant="outlined" onClick={logout}>
                Logout
              </Button>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
