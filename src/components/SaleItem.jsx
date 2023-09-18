/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import LogoStore from "./LogoStore";
import styles from "./SaleItem.module.css";
export default function SaleItem({
  name,
  price_sale,
  price_regular,
  price_per_unit_sale,
  // eslint-disable-next-line no-unused-vars
  discount_percentage,
  img_url,
  unit,
  sale_start_date,
  sale_end_date,
  store_url,
}) {
  const regex = /\/(\d+)\.png$/;
  const match = img_url.match(regex);
  const dateStart = new Date(sale_start_date);
  const dateEnd = new Date(sale_end_date);
  const formattedDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // months are zero-based, add 1

    return `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}`;
  };
  const extractTLD = (url) => {
    try {
      const parsedUrl = new URL(url);
      const hostnameParts = parsedUrl.hostname.split(".");
      if (hostnameParts.length > 1) {
        return hostnameParts[hostnameParts.length - 2];
      }
    } catch (error) {
      console.error("Invalid URL:", error);
    }
    return "unknown";
  };
  const storeName = extractTLD(store_url);
  return (
    <div className={styles.saleItem}>
      <LogoStore storeName={storeName} />
      <h4 className={styles.item1}>{`${formattedDate(
        dateStart
      )}-${formattedDate(dateEnd)}`}</h4>
      {storeName === "maxi" ? (
        <img
          className={styles.item2}
          src={`https://d2wc5be2byue2g.cloudfront.net/maxi_${match[1]}.webp`}
        />
      ) : (
        <img src="" />
      )}
      <h3 className={styles.item3}>{name}</h3>
      <h2 className={styles.item4}>{price_sale}</h2>
      <h4 className={styles.item5}>
        <strike>{price_regular}</strike>
      </h4>
      <h4 className={styles.item6}>
        {price_per_unit_sale}/{unit}
      </h4>
      {/* <h4>-{discount_percentage}%</h4> */}
    </div>
  );
}
