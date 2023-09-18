import { useEffect, useState } from "react";
import axios from "axios";
import SaleItem from "../../components/SaleItem";
import styles from "./Home.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Home() {
  const [saleItems, setSaleItems] = useState([]);
  const [store, setStore] = useState("maxi");
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:3001/saleItems/${store}`)
      .then((response) => {
        setSaleItems(response.data);
        console.log(response.data);
      })
      .catch();
  }, [store]);
  const handleChange = (event) => {
    setStore(event.target.value);
  };
  return (
    <>
      <FormControl className={styles.selectStoreForm} fullWidth>
        <InputLabel>Prodavnica</InputLabel>
        <Select
          className={styles.selectStore}
          value={store}
          label="Store name"
          onChange={handleChange}
        >
          <MenuItem value="maxi">Maxi</MenuItem>
          <MenuItem value="uni">Univerexport</MenuItem>
        </Select>
      </FormControl>
      <div className={styles.angryGrid}>
        {saleItems.length > 0 ? (
          <>
            {saleItems.map((item, index) => (
              <SaleItem
                key={index}
                name={item.name}
                price_sale={item.price_sale}
                price_regular={item.price_regular}
                price_per_unit_sale={item.price_per_unit_sale}
                discount_percentage={item.discount_percentage}
                img_url={item.img_url}
                unit={item.unit}
                sale_start_date={item.sale_start_date}
                sale_end_date={item.sale_end_date}
                store_url={item.store_url}
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
