import React from "react";

const styles = {
  label: "flex-1 w-full flex flex-col",
  labelName:
    "font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]",
  input:
    "py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]",
};

const FormField = ({
  labelName,
  placeholder,
  inputType = "text", // Valor predeterminado para inputType
  isTextArea = false, // Valor predeterminado para isTextArea
  value,
  handleChange,
}) => {
  return (
    <label className={styles.label}>
      {labelName && <span className={styles.labelName}>{labelName}</span>}
      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={styles.input}
        />
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={styles.input}
        />
      )}
    </label>
  );
};

export default FormField;
