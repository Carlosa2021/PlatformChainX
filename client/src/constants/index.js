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
    link: "/",
  },
  {
    name: "Admin",
    imgUrl: createCampaign,
    link: "/create-campaign",
    disabled: false,
  },
  {
    name: "Billetera",
    imgUrl: payment,
    link: "/payment",
    disabled: false,
  },
  {
    name: "Retiros",
    imgUrl: withdraw,
    link: "/withdraw",
    disabled: false,
  },
  {
    name: "Usuario",
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
