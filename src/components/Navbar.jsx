/* eslint-disable react/prop-types */
import { AppBar, Button, Toolbar } from "@mui/material";
import styles from "./Navbar.module.css";

export default function Navbar({ handleLogin, btnLoginText }) {
  return (
    <div className={styles.navbar}>
      <AppBar position="static">
        <Toolbar>
          <div className={styles.btnLogin}>
            <Button onClick={handleLogin} color="inherit">
              {btnLoginText}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
