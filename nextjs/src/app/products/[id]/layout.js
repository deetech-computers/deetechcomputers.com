import "./product-detail-tokens.css";
import "./product-detail-desktop.css";
import "./product-detail-mobile.css";

export default function ProductDetailLayout({ children }) {
  return <div className="product-detail-route">{children}</div>;
}
