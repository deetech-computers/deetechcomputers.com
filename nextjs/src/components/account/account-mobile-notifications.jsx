"use client";

import Link from "next/link";
import { formatNotificationTime } from "@/lib/header-notifications";

function getNotificationKindLabel(item) {
  return item?.kind === "message" ? "Support update" : "Order update";
}

function getNotificationActionLabel(item) {
  return item?.kind === "order" ? "Track Shipment" : "Open update";
}

function MobileNotificationsIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    person: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="9" r="3" />
        <path d="M6.8 18.3a6.2 6.2 0 0 1 10.4 0" />
      </>
    ),
    external: (
      <>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
    truck: (
      <>
        <path d="M10 17h4V5H2v12h3" />
        <path d="M14 8h4l4 4v5h-3" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    check: (
      <>
        <path d="m20 6-11 11-5-5" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-notifications__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.external}
    </svg>
  );
}

export default function MobileNotifications({
  notifications,
  readIds,
  onOpenNotification,
  onMarkAllRead,
}) {
  const hasNotifications = notifications.length > 0;

  return (
    <section className="account-mobile-notifications" aria-label="Notifications">
      <header className="account-mobile-notifications__head">
        <Link href="/account" aria-label="Back to account">
          <MobileNotificationsIcon name="arrowLeft" />
        </Link>
        <div className="account-mobile-notifications__title">
          {!hasNotifications ? <span>Account</span> : null}
          <h1>Notifications</h1>
        </div>
        {hasNotifications ? (
          <button type="button" onClick={onMarkAllRead}>Mark all read</button>
        ) : (
          <Link href="/account" className="account-mobile-notifications__profile" aria-label="Account menu">
            <MobileNotificationsIcon name="person" />
          </Link>
        )}
      </header>

      {hasNotifications ? (
        <div className="account-mobile-notifications__list">
          {notifications.map((item) => {
            const itemId = String(item?.id || "");
            const isUnread = !readIds.includes(itemId);
            const isOrder = item?.kind === "order";
            return (
              <article key={itemId} className={isUnread ? "account-mobile-notifications__card is-unread" : "account-mobile-notifications__card"}>
                <div className="account-mobile-notifications__card-head">
                  <span>{getNotificationKindLabel(item)}</span>
                  <em>{isUnread ? "Unread" : "Read"}</em>
                </div>
                <h2>{item.title || "Account update"}</h2>
                <p>{item.body || "Open this update to see the latest details."}</p>
                <div className="account-mobile-notifications__meta">
                  <time dateTime={item.timestamp ? new Date(item.timestamp).toISOString() : undefined}>
                    {formatNotificationTime(item.timestamp)}
                  </time>
                  <MobileNotificationsIcon name={isOrder ? "truck" : "message"} />
                </div>
                <Link
                  href={item.href || "/account"}
                  className={isOrder ? "account-mobile-notifications__action is-outline" : "account-mobile-notifications__action"}
                  onClick={() => onOpenNotification(itemId)}
                >
                  <span>{getNotificationActionLabel(item)}</span>
                  {!isOrder ? <MobileNotificationsIcon name="external" /> : null}
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="account-mobile-notifications__empty">
          <div className="account-mobile-notifications__empty-mark" aria-hidden="true">
            <MobileNotificationsIcon name="bell" />
            <span><MobileNotificationsIcon name="check" /></span>
          </div>
          <h2>All caught up!</h2>
          <p>We will notify you here when there are updates to your orders or account.</p>
          <Link href="/products?promotion=just_landed#shop-results" className="account-mobile-notifications__empty-action">
            <span>Browse New Arrivals</span>
            <MobileNotificationsIcon name="arrowRight" />
          </Link>
        </section>
      )}
    </section>
  );
}
