import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <h3>Deetech Computers</h3>
          <p>
            Standalone Next.js frontend with the existing backend contract preserved.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3>Account</h3>
          <ul>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
            <li><Link href="/account">Dashboard</Link></li>
            <li><Link href="/edit-account">Edit Profile</Link></li>
            <li><Link href="/orders">Orders</Link></li>
            <li><Link href="/messages">Messages</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3>Policies</h3>
          <ul>
            <li><Link href="/warranty">Warranty</Link></li>
            <li><Link href="/delivery-policy">Delivery Policy</Link></li>
            <li><Link href="/return-refund">Return and Refund</Link></li>
            <li><Link href="/payment-policy">Payment Policy</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-of-use">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
