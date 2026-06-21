import { Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./admin-shell.css";
import "./admin-dashboard.css";
import "./admin-dashboard-mobile.css";
import "./admin-orders.css";
import "./admin-orders-mobile.css";

const adminSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--admin-font-sans",
  display: "swap",
});

const adminMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--admin-font-mono",
  display: "swap",
});

export default function AdminLayout({ children }) {
  return <div className={`admin-route ${adminSans.variable} ${adminMono.variable}`}>{children}</div>;
}
