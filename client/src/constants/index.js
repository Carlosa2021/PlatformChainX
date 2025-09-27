import {
  createCampaign,
  dashboard,
  payment,
  profile,
  withdraw,
  logout,
} from "../assets";

export const navlinks = [
  {
    name: "Dashboard",
    imgUrl: dashboard,
    link: "/dashboard",
  },
  {
    name: "Tokenize Asset",
    imgUrl: createCampaign,
    link: "/tokenize",
    disabled: false,
  },
  {
    name: "Investors",
    imgUrl: profile,
    link: "/investors",
    disabled: false,
  },
  {
    name: "Payments",
    imgUrl: payment,
    link: "/payment",
    disabled: false,
  },
  {
    name: "Withdraw",
    imgUrl: withdraw,
    link: "/withdraw",
    disabled: false,
  },
  {
    name: "Profile",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    imgUrl: logout,
    link: "/",
    disabled: false,
  },
];
