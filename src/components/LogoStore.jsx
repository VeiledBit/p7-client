import styles from "./LogoStore.module.css";
import logoUni from "../assets/logo_uni.webp";
import logoMaxi from "../assets/logo_maxi.webp";
import logoLidl from "../assets/logo_lidl.webp"
// eslint-disable-next-line react/prop-types
export default function LogoStore({ storeName }) {
  let logo;
  if (storeName === "maxi") {
    logo = <img className={`${styles.logo} ${styles.maxi}`} src={logoMaxi} />;
  } else if (storeName === "elakolije") {
    logo = <img className={`${styles.logo} ${styles.uni}`} src={logoUni} />;
  } else if (storeName === "lidl") {
    logo = <img className={`${styles.logo} ${styles.lidl}`} src={logoLidl} />;
  }
  return <>{logo}</>;
}
