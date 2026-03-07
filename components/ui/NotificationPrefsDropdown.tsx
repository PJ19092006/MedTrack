"use client";

import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/MedTrack/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/MedTrack/components/ui/dropdown-menu";

export type NotificationPrefs = {
  emailNotifications: boolean;
  pushNotifications: boolean; // in-app
  smsNotifications: boolean;

  // We'll reuse these as reminder categories
  comments: boolean; // dueSoon
  mentions: boolean; // overdue
  updates: boolean; // eligibleNow
};

const DEFAULT_PREFS: NotificationPrefs = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  comments: true,
  mentions: true,
  updates: false,
};

type Props = {
  unreadCount?: number;
  onPrefsChange?: (prefs: NotificationPrefs) => void;
};

export default function NotificationPrefsDropdown({
  unreadCount = 0,
  onPrefsChange,
}: Props) {
  const [notifPrefs, setNotifPrefs] =
    useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const saved = localStorage.getItem("notification-prefs");
    if (saved) setNotifPrefs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("notification-prefs", JSON.stringify(notifPrefs));
    onPrefsChange?.(notifPrefs);
  }, [notifPrefs, onPrefsChange]);

  const updatePref = (key: keyof NotificationPrefs, value: boolean) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const anyChannelEnabled = useMemo(
    () =>
      notifPrefs.emailNotifications ||
      notifPrefs.pushNotifications ||
      notifPrefs.smsNotifications,
    [notifPrefs],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-4 w-4" />
          <span className="ml-2">Notifications</span>

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Notification Channels</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={notifPrefs.emailNotifications}
          onCheckedChange={(checked) =>
            updatePref("emailNotifications", Boolean(checked))
          }
        >
          Email Notifications
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={notifPrefs.pushNotifications}
          onCheckedChange={(checked) =>
            updatePref("pushNotifications", Boolean(checked))
          }
        >
          In-App Notifications
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={notifPrefs.smsNotifications}
          onCheckedChange={(checked) =>
            updatePref("smsNotifications", Boolean(checked))
          }
        >
          SMS Notifications
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Notify Me About</DropdownMenuLabel>

        {!anyChannelEnabled && (
          <p className="px-2 py-2 text-xs text-muted-foreground">
            Enable at least one channel to receive reminders.
          </p>
        )}

        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={notifPrefs.comments}
            onCheckedChange={(checked) =>
              updatePref("comments", Boolean(checked))
            }
          >
            Due Soon Vaccines
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={notifPrefs.mentions}
            onCheckedChange={(checked) =>
              updatePref("mentions", Boolean(checked))
            }
          >
            Overdue Vaccines
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={notifPrefs.updates}
            onCheckedChange={(checked) =>
              updatePref("updates", Boolean(checked))
            }
          >
            Newly Eligible Vaccines
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
