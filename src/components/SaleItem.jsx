/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import LogoStore from "./LogoStore";
import styles from "./SaleItem.module.css";
import hangingSign from "../assets/hangingSign.webp";
import placeholder from "../assets/placeholder.png";
import { Tooltip } from "@mui/material";
import SmartphoneIcon from '@mui/icons-material/Smartphone';

export default function SaleItem({
  store,
  store_id,
  name,
  price_sale,
  price_regular,
  price_per_unit_sale,
  price_per_unit_regular,
  discount_percentage,
  unit,
  sale_start_date,
  sale_end_date,
  note,
}) {
  const dateStart = new Date(sale_start_date);
  const dateEnd = new Date(sale_end_date);
  const formattedDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // months are zero-based, add 1

    return `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}`;
  };

  const unitLarger = () => {
    const pattern = /kg|g/;
    if (pattern.test(unit)) {
      return "kg";
    } else {
      return "l";
    }
  };

  return (
    <div className={styles.saleItem}>
      <LogoStore storeName={store} />
      <h4 className={styles.item1}>{`${formattedDate(
        dateStart
      )}-${formattedDate(dateEnd)}`}</h4>
      <div className={styles.item2}>
        {note.includes("Cena za kupovinu 2 artikla") && (
          <>
            <img className={styles.imageWoodInfo} src={hangingSign} />
            <Tooltip title="CENA ZA KUPOVINU 2 ARTIKLA">
              <h4 className={styles.discountItemsRequired}>x2</h4>
            </Tooltip>
          </>
        )}
        {note.includes("Samo uz Moj Maxi aplikaciju") && (
          <>
            <img className={styles.imageWoodInfo} src={hangingSign} />
            <Tooltip title="SAMO UZ MOJ MAXI APLIKACIJU">
              <SmartphoneIcon className={styles.iconSmartphone} />
            </Tooltip>
          </>
        )}
        <img
          className={styles.imageProduct}
          src={`https://pub-9f9f2ae302be494cbffe02dd7ff666a1.r2.dev/${store}_${store_id}.webp`}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
        />
        <img className={styles.imageWoodSign} src={hangingSign} />
        <h4 className={styles.discountPercentage}>-{discount_percentage}%</h4>
      </div>
      <h3 className={styles.item3}>{name}</h3>
      <h2 className={styles.item4}>{price_sale}</h2>
      <h4 className={styles.item5}>
        <strike>{price_regular}</strike>
      </h4>
      <h4 className={styles.item6}>
        {price_per_unit_sale}/{unit}
      </h4>
      {store === "maxi" && (
        <h4 className={styles.item7}>
          <strike>
            {price_per_unit_regular}/{unitLarger()}
          </strike>
        </h4>
      )}
    </div>
  );
}
