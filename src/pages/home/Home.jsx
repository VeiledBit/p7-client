import { useEffect, useState } from "react";
import axios from "axios";
import SaleItem from "../../components/SaleItem";
import styles from "./Home.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import baseUrl from "../../config/url";

export default function Home() {
  const [saleItems, setSaleItems] = useState([]);
  const [store, setStore] = useState("maxi");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("category");
  let delayTimer;

  useEffect(() => {
    if (search === "" || search.length < 2) {
      axios
        .get(`${baseUrl}/saleItems/${store}/?sort=${sort}`)
        .then((response) => {
          setSaleItems(response.data);
          console.log(response.data);
        })
        .catch();
    } else {
      axios
        .get(`${baseUrl}/saleItems/${store}/?search=${search}&sort=${sort}`)
        .then((response) => {
          setSaleItems(response.data);
          console.log(response.data);
        })
        .catch();
    }
  }, [store, search, sort]);

  const handleChange = (event) => {
    setStore(event.target.value);
  };

  const handleChangeSort = (event) => {
    setSort(event.target.value);
  };

  const handleChangeSearchItems = (event) => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      setSearch(event.target.value)
    }, 750);
  };
  return (
    <>
      <div className={styles.gridSettings}>
        <TextField
          className={styles.textFieldSearch}
          label="Pretraga"
          variant="outlined"
          onChange={handleChangeSearchItems}
          InputProps={{ sx: { borderRadius: "1rem" } }}
        />
        <FormControl className={styles.selectStoreForm} fullWidth>
          <InputLabel id="selectStore">Prodavnica</InputLabel>
          <Select
            className={styles.selectStore}
            value={store}
            onChange={handleChange}
            label="selectStore"
          >
            <MenuItem value="maxi">Maxi</MenuItem>
            <MenuItem value="elakolije">Univerexport</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={styles.selectSortForm} fullWidth>
          <InputLabel id="selectSort">Sortiranje</InputLabel>
          <Select
            className={styles.selectSort}
            value={sort}
            label="selectSort"
            onChange={handleChangeSort}
          >
            <MenuItem value="category">Kategorija</MenuItem>
            <MenuItem value="discountHighest">Najveci popust</MenuItem>
            <MenuItem value="discountLowest">Najnizi popust</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={styles.angryGrid}>
        {saleItems.length > 0 ? (
          <>
            {saleItems.map((item, index) => (
              <SaleItem
                key={index}
                store={store}
                store_id={item.store_id}
                name={item.name}
                price_sale={item.price_sale}
                price_regular={item.price_regular}
                price_per_unit_sale={item.price_per_unit_sale}
                discount_percentage={item.discount_percentage}
                unit={item.unit}
                sale_start_date={item.sale_start_date}
                sale_end_date={item.sale_end_date}
              />
            ))}
          </>
        ) : (
          <h1>Nothing</h1>
        )}
      </div>
    </>
  );
}
