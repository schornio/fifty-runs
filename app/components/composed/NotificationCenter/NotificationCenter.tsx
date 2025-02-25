"use client";

import useSWR from "swr";
import { IoIosNotifications } from "react-icons/io";
import { useState, useRef } from "react";

type Notification = {
  id: string;
  title: string;
  description: string;
  date: string; 
  read: boolean; 
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NotificationCenter() {
  const { data, error, mutate } = useSWR<{ notifications: Notification[] }>(
    "/api/notifications",
    fetcher,
    {
      refreshInterval: 5000,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
    }
  );

  const notifications = data?.notifications || [];
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //mark all unread notifications as read
  async function markAsRead() {
    const unreadNotifications = notifications.filter((n) => !n.read);
    if (unreadNotifications.length > 0) {
      await fetch("/api/notifications/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unreadNotifications.map((n) => n.id) }),
      });
      mutate();
    }
  }

  const toggleDropdown = () => {
    if (showDropdown) {
      markAsRead();
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-2xl text-gray-600 hover:text-gray-800"
      >
        <IoIosNotifications />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold">Neueste Aktivitäten 🏃</h3>
            {error ? (
              <p className="text-sm text-gray-500">Fehler beim Laden der Benachrichtigungen.</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500">Es gibt keine neuen Benachrichtigungen.</p>
            ) : (
              <ul className="max-h-60 overflow-y-auto">
                {notifications.map((notification) => (
                  <li key={notification.id} className="mb-3 border-b pb-2 flex items-center">
                    {!notification.read && (
                      <span className="inline-block h-2 w-2 bg-blue-500 rounded-full mr-2" />
                    )}
                    <div>
                      <p className="text-sm font-bold">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.description}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Laufdatum: {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
