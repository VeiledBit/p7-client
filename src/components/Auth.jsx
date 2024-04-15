/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import {
  Modal,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./Auth.module.css";

export default function AuthModal({ isOpen, onClose, supabase, setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null); // Handle password field focus when clicking adornment icon

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    const input = passwordInputRef.current;

    if (!input) return;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    setShowPassword(!showPassword);

    // Handles input cursor resetting to beginning on icon click on Chrome
    setTimeout(() => {
      input.setSelectionRange(selectionStart, selectionEnd);
      input.focus();
    }, 0);
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      return;
    }

    setSession(data.session);
    onClose();
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      return;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalLogin}>
        <TextField
          className={styles.modalLoginField}
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          inputRef={emailInputRef}
        />
        <TextField
          className={styles.modalLoginField}
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputRef={passwordInputRef}
        />
        <div className={styles.containerBtn}>
          <Button
            className={styles.btn}
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            className={styles.btn}
            variant="contained"
            color="primary"
            onClick={handleRegister}
          >
            Register
          </Button>
        </div>
      </div>
    </Modal>
  );
}
