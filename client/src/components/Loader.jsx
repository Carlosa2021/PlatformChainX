import React from "react";
import { loader } from "../assets";

const styles = {
  loaderContainer:
    "fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col",
  loaderImage: "w-[100px] h-[100px] object-contain",
  loaderText:
    "mt-[20px] font-epilogue font-bold text-[20px] text-white text-center",
};

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <img src={loader} alt="loader" className={styles.loaderImage} />
      <p className={styles.loaderText}>
        Transaction is in progress <br /> Please wait...
      </p>
    </div>
  );
};

export default Loader;
