/* eslint-disable react/prop-types */
import LogoStore from "./LogoStore";
import styles from "./SaleItem.module.css";
import hangingSign from "../assets/hangingSign.webp";
import placeholder from "../assets/placeholder.png";
import { Tooltip } from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import baseUrl from "../config/url";
import supabase from "../config/supabase";
import { useEffect, useState } from "react";

export default function SaleItem({
  isPriceRoundChecked,
  id,
  store,
  name,
  price_sale,
  price_sale_rounded,
  price_regular,
  price_regular_rounded,
  price_per_unit_sale,
  price_per_unit_sale_rounded,
  price_per_unit_regular,
  price_per_unit_regular_rounded,
  discount_percentage,
  unit,
  sale_start_date,
  sale_end_date,
  img_url,
  note,
  isFavored,
  handleOpenSnackbar,
  setSnackbarMessage,
  setSnackbarSeverity,
}) {
  const [isFavoredState, setIsFavoredState] = useState();
  const dateStart = new Date(sale_start_date);
  const dateEnd = new Date(sale_end_date);
  const formattedDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // months are zero-based, add 1

    return `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}`;
  };

  useEffect(() => {
    setIsFavoredState(isFavored);
  }, [isFavored]);

  const handleFavorite = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session !== null) {
      axios
        .put(
          `${baseUrl}/saleItems/${store}/favorite`,
          { itemId: id },
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setIsFavoredState(!isFavoredState);
            setSnackbarMessage("Proizvod uklonjen iz omiljenih.");
            setSnackbarSeverity("success");
            handleOpenSnackbar();
          } else if (response.status === 201) {
            setIsFavoredState(!isFavoredState);
            setSnackbarMessage("Proizvod sačuvan u omiljene.");
            setSnackbarSeverity("success");
            handleOpenSnackbar();
          }
        });
    } else {
      setSnackbarMessage("Ulogujte se da bi ste sačuvali proizvod u omiljene.");
      setSnackbarSeverity("warning");
      handleOpenSnackbar();
    }
  };

  return (
    <div className={styles.saleItem}>
      <LogoStore storeName={store} />
      {sale_end_date !== null && (
        <h4 className={styles.item1}>{`${formattedDate(
          dateStart
        )}-${formattedDate(dateEnd)}`}</h4>
      )}
      {sale_end_date === null && (
        <h4 className={styles.item1}>{`od ${formattedDate(dateStart)}`}</h4>
      )}
      <div className={styles.item2}>
        {store === "maxi" &&
          typeof note !== "undefined" &&
          note.includes("Cena za kupovinu 2 artikla") && (
            <>
              <img className={styles.imageWoodInfo} src={hangingSign} />
              <Tooltip title="CENA ZA KUPOVINU 2 ARTIKLA">
                <h4 className={styles.discountItemsRequired}>x2</h4>
              </Tooltip>
            </>
          )}
        {store === "maxi" &&
          typeof note !== "undefined" &&
          note.includes("Cena za kupovinu 3 artikla") && (
            <>
              <img className={styles.imageWoodInfo} src={hangingSign} />
              <Tooltip title="CENA ZA KUPOVINU 3 ARTIKLA">
                <h4 className={styles.discountItemsRequired}>x3</h4>
              </Tooltip>
            </>
          )}
        {store === "maxi" &&
          typeof note !== "undefined" &&
          note.includes("Samo uz Moj Maxi aplikaciju") && (
            <>
              <img className={styles.imageWoodInfo} src={hangingSign} />
              <Tooltip title="SAMO UZ MOJ MAXI APLIKACIJU">
                <SmartphoneIcon className={styles.iconSmartphone} />
              </Tooltip>
            </>
          )}
        <img
          className={styles.imageProduct}
          src={img_url}
          onClick={handleFavorite}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
        />
        {isFavoredState ? (
          <FavoriteIcon className={styles.iconFavorite} />
        ) : (
          <></>
        )}
        {discount_percentage !== null && discount_percentage !== 0 && (
          <>
            <img className={styles.imageWoodSign} src={hangingSign} />
            <h4 className={styles.discountPercentage}>
              -{discount_percentage}%
            </h4>
          </>
        )}
      </div>
      <h3 className={styles.item3}>{name}</h3>
      <h2
        className={
          discount_percentage > 0 ? styles.item4 : styles.item4Centered
        }
      >
        {isPriceRoundChecked ? price_sale_rounded : price_sale}
      </h2>
      {discount_percentage > 0 && (
        <h4 className={styles.item5}>
          <strike>
            {isPriceRoundChecked ? price_regular_rounded : price_regular}
          </strike>
        </h4>
      )}
      {price_per_unit_sale && (
        <h4
          className={
            discount_percentage > 0 ? styles.item6 : styles.item6Centered
          }
        >
          {isPriceRoundChecked
            ? price_per_unit_sale_rounded
            : price_per_unit_sale}
          /{unit}
        </h4>
      )}
      {store === "maxi" &&
        price_per_unit_regular &&
        discount_percentage > 0 && (
          <h4 className={styles.item7}>
            <strike>
              {isPriceRoundChecked
                ? price_per_unit_regular_rounded
                : price_per_unit_regular}
              /{unit}
            </strike>
          </h4>
        )}
    </div>
  );
}
