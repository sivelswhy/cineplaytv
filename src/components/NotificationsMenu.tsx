import { useQuery } from "@tanstack/react-query";
import { getNotifications, type Notification } from "@/lib/tmdb";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationsMenu = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  useEffect(() => {
    // Get read notifications from localStorage
    const readNotifications = new Set(JSON.parse(localStorage.getItem("readNotifications") || "[]"));
    setUnreadCount(notifications.filter(n => !readNotifications.has(n.id)).length);
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const readNotifications = new Set(JSON.parse(localStorage.getItem("readNotifications") || "[]"));
    readNotifications.add(notification.id);
    localStorage.setItem("readNotifications", JSON.stringify(Array.from(readNotifications)));
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Navigate based on notification type
    if (notification.data?.movieId) {
      navigate(`/${notification.data.mediaType}/${notification.data.movieId}/watch`);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_content":
        return "🎬";
      case "watch_progress":
        return "▶️";
      case "system":
        return "🔔";
      default:
        return "📌";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative" aria-label="Notifications">
          <Bell className="w-6 h-6 text-white hover:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-black/95 text-white border border-gray-800 p-2 rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                localStorage.setItem("readNotifications", JSON.stringify(notifications.map(n => n.id)));
                setUnreadCount(0);
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No notifications</div>
          ) : (
            notifications.map((notification) => {
              const readNotifications = new Set(JSON.parse(localStorage.getItem("readNotifications") || "[]"));
              const isRead = readNotifications.has(notification.id);

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 p-3 hover:bg-gray-800/50 cursor-pointer rounded-lg transition-colors mb-1 ${
                    isRead ? "opacity-60" : ""
                  }`}
                >
                  <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-400 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu; 