
import {  LiaClipboardListSolid } from 'react-icons/lia';
import { IoSettingsOutline } from "react-icons/io5";
import { RiDashboardFill } from 'react-icons/ri';
import { FaHospitalUser } from "react-icons/fa";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdNewspaper } from 'react-icons/md';

export const navLink = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: RiDashboardFill,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: LiaClipboardListSolid,
  },
  {
    name: "Patients",
    href: "/dashboard/patients",
    icon: FaHospitalUser ,

  },
  {
    name: "Plan",
    href: "/dashboard/plan",
    icon: CiMoneyCheck1 ,

  },
  {
    name: "Sports",
    href: "/dashboard/sports",
    icon: CiMoneyCheck1 ,

  },
  {
    name: "Newsletter",
    href: "/dashboard/newsletter",
    icon: MdNewspaper  ,

  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: IoSettingsOutline,
  }
];
