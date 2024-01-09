/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import SaleItem from "../../components/SaleItem";
import styles from "./Home.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import baseUrl from "../../config/url";

export default function Home() {
  const [saleItems, setSaleItems] = useState([]);
  const [store, setStore] = useState("maxi");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("category");
  const [categoryValues, setCategoryValues] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(true);
  const [categories, setCategories] = useState(categoryValues);
  const [isPriceRoundChecked, setIsPriceRoundChecked] = useState(false);
  const [page, setPage] = useState(1);
  const [isSpinnerLoadingShown, setIsSpinnerLoadingShown] = useState(true);
  const [isBtnLoadMoreShown, setIsBtnLoadMoreShown] = useState(false);
  let delayTimer;

  useEffect(() => {
    axios
      .get(`${baseUrl}/saleItems/${store}/categories`)
      .then((response) => {
        setCategoryValues(response.data);
        setCategories(response.data);
      })
      .catch();
  }, [store]);

  useEffect(() => {
    if (search === "" || search.length < 2) {
      setIsSpinnerLoadingShown(true);
      axios
        .get(
          `${baseUrl}/saleItems/${store}/?sort=${sort}&categories=${categories.join(
            "|"
          )}`
        )
        .then((response) => {
          if (response.data.length == 90) {
            setIsBtnLoadMoreShown(true);
          } else {
            setIsBtnLoadMoreShown(false);
          }
          setIsSpinnerLoadingShown(false);
          setSaleItems(response.data);
        })
        .catch();
    } else {
      setIsSpinnerLoadingShown(true);
      axios
        .get(
          `${baseUrl}/saleItems/${store}/?page${page}&search=${search}&sort=${sort}&categories=${categories.join(
            "|"
          )}`
        )
        .then((response) => {
          if (response.data.length == 90) {
            setIsBtnLoadMoreShown(true);
          } else {
            setIsBtnLoadMoreShown(false);
          }
          setIsSpinnerLoadingShown(false);
          setSaleItems(response.data);
        })
        .catch();
    }
  }, [store, search, sort, categories]);

  useEffect(() => {
    console.log(isPriceRoundChecked);
  }, [isPriceRoundChecked]);

  const handleChange = (event) => {
    setStore(event.target.value);
  };

  const handleChangeSort = (event) => {
    setSort(event.target.value);
  };

  const handleChangeSearchItems = (event) => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      setSearch(event.target.value);
    }, 750);
  };

  const handleChangeCategories = (event) => {
    const {
      target: { value },
    } = event;
    if (value.length === categoryValues.length && !selectAllCategories) {
      setSelectAllCategories(true);
    } else {
      setSelectAllCategories(false);
    }
    setCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeAllCategories = (event) => {
    const checked = event.target.checked;
    setSelectAllCategories(checked);
    if (checked) {
      setCategories(categoryValues);
    } else {
      setCategories([]);
    }
  };

  const handleChangeSwitchPriceRound = () => {
    setIsPriceRoundChecked(!isPriceRoundChecked);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    axios
      .get(
        `${baseUrl}/saleItems/${store}/?page=${nextPage}&sort=${sort}&categories=${categories.join(
          "|"
        )}`
      )
      .then((response) => {
        const newItems = response.data;
        if (newItems.length == 90) {
          setIsBtnLoadMoreShown(true);
        } else {
          setIsBtnLoadMoreShown(false);
        }
        setSaleItems([...saleItems, ...newItems]);
      })
      .catch();
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
            <MenuItem value="priceLowest">Najniza cena</MenuItem>
            <MenuItem value="priceHighest">Najveca cena</MenuItem>
            <MenuItem value="pricePerUnitLowest">
              Najniza cena po jednicnoj meri
            </MenuItem>
            <MenuItem value="pricePerUnitHighest">
              Najveca cena po jednicnoj meri
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl className={styles.selectCategoryForm} fullWidth>
          <InputLabel id="selectCategory">Kategorije</InputLabel>
          <Select
            multiple
            className={styles.selectCategory}
            value={categories}
            label="selectCategory"
            onChange={handleChangeCategories}
            renderValue={(selected) => selected.join(", ")}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <MenuItem>
                    <Checkbox
                      checked={selectAllCategories}
                      onChange={handleChangeAllCategories}
                    />
                  </MenuItem>
                }
                label="Sve"
              />
            </FormGroup>
            <Divider />
            {categoryValues.map((item) => (
              <MenuItem key={item} value={item}>
                <Checkbox checked={categories.indexOf(item) > -1} />
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          className={styles.switchPriceRound}
          control={
            <Switch
              checked={isPriceRoundChecked}
              onChange={handleChangeSwitchPriceRound}
            />
          }
          label="Zaokruzi cene"
        />
      </div>
      <div className={styles.angryGrid}>
        {saleItems.length > 0 ? (
          <>
            {saleItems.map((item, index) => (
              <SaleItem
                isPriceRoundChecked={isPriceRoundChecked}
                key={index}
                store={store}
                store_id={item.store_id}
                name={item.name}
                price_sale={item.price_sale}
                price_sale_rounded={item.price_sale_rounded}
                price_regular={item.price_regular}
                price_regular_rounded={item.price_regular_rounded}
                price_per_unit_sale={item.price_per_unit_sale}
                price_per_unit_sale_rounded={item.price_per_unit_sale_rounded}
                price_per_unit_regular={item.price_per_unit_regular}
                price_per_unit_regular_rounded={
                  item.price_per_unit_regular_rounded
                }
                discount_percentage={item.discount_percentage}
                unit={item.unit}
                sale_start_date={item.sale_start_date}
                sale_end_date={item.sale_end_date}
                note={item.note}
              />
            ))}
          </>
        ) : (
          <>
            {isSpinnerLoadingShown ? (
              <Box className={styles.spinner}>
                <CircularProgress />
              </Box>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {isBtnLoadMoreShown && (
        <Button
          className={styles.btnLoadMore}
          variant="contained"
          size="large"
          onClick={handleLoadMore}
        >
          Učitaj još
        </Button>
      )}
    </>
  );
}
