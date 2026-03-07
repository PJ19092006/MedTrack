"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/MedTrack/components/ui/badge";
import { Button } from "@/MedTrack/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/MedTrack/components/ui/popover";
import { Separator } from "@/MedTrack/components/ui/separator";

type Notif = { id: string; title: string; time: string };

const Example = () => {
  const [notifications, setNotifications] = React.useState<Notif[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    };
    load();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative" size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
          <Badge className="-right-1 -top-1 absolute h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            {notifications.length}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <Button size="sm" variant="ghost">
              Mark all as read
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div key={notif.id} className="text-sm">
                <p className="font-medium">{notif.title}</p>
                <p className="text-muted-foreground text-xs">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Example;
