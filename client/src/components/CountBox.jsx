import React from 'react';

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px] shadow-md rounded-[15px] overflow-hidden">
      <h4
        className="font-epilogue font-bold text-[30px] 
        text-black dark:text-gray-200 
        p-3 
        bg-gray-200 dark:bg-[#1f1f23] 
        w-full text-center truncate"
      >
        {value}
      </h4>
      <p
        className="font-epilogue font-normal text-[16px] 
        text-gray-600 dark:text-gray-400 
        bg-gray-100 dark:bg-[#363535] 
        px-3 py-2 
        w-full text-center"
      >
        {title}
      </p>
    </div>
  );
};

export default CountBox;
