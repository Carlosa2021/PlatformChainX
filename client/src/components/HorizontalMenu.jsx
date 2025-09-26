import React, { useContext } from 'react';
import { ThemeContext } from '../../src/components/ThemeContext';

const HorizontalMenu = ({ tabs, selectedTab, onTabSelect }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex gap-x-3 mt-10 border-b border-white/20">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onTabSelect(tab.key)}
            className={`relative px-4 py-2 text-sm md:text-base font-semibold rounded-t-md transition-all duration-300 ease-in-out
              ${
                isActive
                  ? 'text-white bg-[#FF751A]'
                  : theme.type === 'dark'
                  ? 'text-white/60 hover:text-white hover:bg-white/10'
                  : 'text-gray-700 hover:text-black hover:bg-gray-200'
              }`}
          >
            {tab.label}
            {isActive && (
              <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-orange-500 rounded-t" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalMenu;
