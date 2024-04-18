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
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Snackbar,
  Switch,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import supabase from "../../config/supabase";
import baseUrl from "../../config/url";
import AuthModal from "../../components/Auth";
import Navbar from "../../components/Navbar";

export default function Home() {
  const [session, setSession] = useState({});
  const [saleItems, setSaleItems] = useState([]);
  const [store, setStore] = useState("maxi");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("category");
  const [categoryValues, setCategoryValues] = useState([]);
  const [selectAllCategories, setSelectAllCategories] = useState(true);
  const [categories, setCategories] = useState(categoryValues);
  const [isPriceRoundChecked, setIsPriceRoundChecked] = useState(false);
  const [isSearchAllStoresChecked, setIsSearchAllStoresChecked] =
    useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [btnLoginText, setBtnLoginText] = useState("");
  const [isSelectStoreDisabled, setIsSelectStoreDisabled] = useState(false);
  const [isSelectCategoryDisabled, setIsSelectCategoryDisabled] =
    useState(false);
  const [page, setPage] = useState(1);
  const [isSpinnerLoadingShown, setIsSpinnerLoadingShown] = useState(true);
  const [isBtnLoadMoreShown, setIsBtnLoadMoreShown] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackBarSeverity, setSnackbarSeverity] = useState("info");
  let delayTimer;

  useEffect(() => {
    const setUpSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session !== null) {
        setSession(data.session);
      }
    };
    setUpSession();
  }, []);

  useEffect(() => {
    Object.keys(session).length === 0
      ? setBtnLoginText("LOGIN")
      : setBtnLoginText("LOGOUT");
  }, [session]);

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
    const setUpSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      let token;
      if (data.session !== null) {
        token = `Bearer ${data.session.access_token}`;
      } else {
        token = `Bearer none`;
      }
      if (search === "" || search.length < 2) {
        setIsSpinnerLoadingShown(true);
        axios
          .get(
            `${baseUrl}/saleItems/${store}/?sort=${sort}&categories=${categories.join(
              "|"
            )}`,
            {
              headers: {
                Authorization: token,
              },
            }
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
        let fetchUrl;
        if (isSearchAllStoresChecked) {
          fetchUrl = `${baseUrl}/saleItems?search=${search}&sort=${sort}`;
        } else {
          fetchUrl = `${baseUrl}/saleItems/${store}/?search=${search}&sort=${sort}&categories=${categories.join(
            "|"
          )}`;
        }
        axios
          .get(fetchUrl, {
            headers: {
              Authorization: token,
            },
          })
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
    };

    setUpSession();
  }, [isSearchAllStoresChecked, store, search, sort, categories]);

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

  const handleChangeSearchAllStores = () => {
    setIsSearchAllStoresChecked(!isSearchAllStoresChecked);
    setIsSelectStoreDisabled(!isSelectStoreDisabled);
    setIsSelectCategoryDisabled(!isSelectCategoryDisabled);
  };

  const handleLogin = () => {
    if (Object.keys(session).length === 0) {
      handleOpenAuthModal();
    } else {
      supabase.auth.signOut();
      setSession({});
      setBtnLoginText("LOGIN");
    }
  };

  const handleOpenAuthModal = () => {
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    axios
      .get(
        `${baseUrl}/saleItems/${store}/?page=${nextPage}&sort=${sort}&categories=${categories.join(
          "|"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
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

  const handleOpenSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSnackbarOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Navbar handleLogin={handleLogin} btnLoginText={btnLoginText} />
      <div className={styles.gridSettings}>
        <TextField
          className={styles.textFieldSearch}
          label="Pretraga"
          variant="outlined"
          onChange={handleChangeSearchItems}
          InputProps={{ sx: { borderRadius: "1rem" } }}
        />
        <FormControl
          disabled={isSelectStoreDisabled}
          className={styles.selectStoreForm}
          fullWidth
        >
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
        <FormControl
          disabled={isSelectCategoryDisabled}
          className={styles.selectCategoryForm}
          fullWidth
        >
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
        <FormControlLabel
          className={styles.switchSearchAllStores}
          control={
            <Switch
              checked={isSearchAllStoresChecked}
              onChange={handleChangeSearchAllStores}
            />
          }
          label="Pretrazi sve prodavnice"
        />
      </div>
      <div className={styles.angryGrid}>
        {saleItems.length > 0 ? (
          <>
            {saleItems.map((item, index) => (
              <SaleItem
                isPriceRoundChecked={isPriceRoundChecked}
                key={index}
                id={item.id}
                store={item.store}
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
                img_url={item.img_url}
                note={item.note}
                isFavored={item.isFavored}
                handleOpenSnackbar={handleOpenSnackbar}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        supabase={supabase}
        setSession={setSession}
      />
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
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        action={action}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
