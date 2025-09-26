import React from 'react';
import { FaDiscord, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-[#1c1c24] text-[#b2b3bd] px-6 py-5 mt-16 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm md:text-base text-center">
        © 2025 <span className="text-orange-500 font-semibold">ChainX</span>{' '}
        with ❤️ from Basel - Suiza
      </p>

      <div className="flex gap-5 text-xl">
        <a
          href="https://discord.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          <FaDiscord />
        </a>
        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          <FaTwitter />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          <FaLinkedinIn />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          <FaYoutube />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
