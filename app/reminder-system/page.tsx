"use client";

import * as React from "react";
import users from "@/MedTrack/lib/mock/users";
import NotificationPrefsDropdown, {
  NotificationPrefs,
} from "@/MedTrack/components/ui/NotificationPrefsDropdown";
import {
  prefsToChannels,
  prefsToTypes,
} from "@/MedTrack/lib/reminders/prefsMap";
import { evaluateUserVaccinesFromCatalog } from "@/MedTrack/lib/reminders/eligibility";
import {
  generateReminders,
  type Reminder,
} from "@/MedTrack/lib/reminders/generate";
import {
  appendToSentReminderLog,
  dedupe,
  loadSentKeys,
  loadSentReminderLog,
  makeKey,
  saveSentKeys,
} from "@/MedTrack/lib/reminders/sentLog";
import { iso } from "@/MedTrack/lib/date";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/MedTrack/components/ui/card";
import { Badge } from "@/MedTrack/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/MedTrack/components/ui/tabs";
import { Separator } from "@/MedTrack/components/ui/separator";
import { AlertTriangle, CheckCircle2, Clock, History } from "lucide-react";

async function sendSMS(to: string, body: string) {
  await fetch("/api/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, body }),
  });
}

async function sendEmail(to: string, subject: string, message: string) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, message }),
  });
}

type BucketItem = { label: string; sub?: string; date?: string | null };

export default function DashboardPage() {
  const [userId, setUserId] = React.useState(users[0].id);
  const [prefs, setPrefs] = React.useState<NotificationPrefs | null>(null);

  const [buckets, setBuckets] = React.useState<{
    overdue: BucketItem[];
    dueSoon: BucketItem[];
    eligible: BucketItem[];
    recent: BucketItem[];
  }>({ overdue: [], dueSoon: [], eligible: [], recent: [] });

  const [activeReminders, setActiveReminders] = React.useState<Reminder[]>([]);
  const [historyReminders, setHistoryReminders] = React.useState<Reminder[]>(
    [],
  );

  React.useEffect(() => {
    if (!prefs) return;

    const run = async () => {
      const user = users.find((u) => u.id === userId)!;
      const today = new Date();
      const todayIso = iso(today);

      // 1) compute eligibility results
      const results = evaluateUserVaccinesFromCatalog(user as any, today);

      // 2) build buckets
      const overdue = results
        .filter((r: any) => r.status === "overdue")
        .map((r: any) => ({
          label: r.vaccineName,
          sub: r.reason,
          date: r.dueDate,
        }));

      const dueSoon = results
        .filter((r: any) => r.status === "dueSoon")
        .map((r: any) => ({
          label: r.vaccineName,
          sub: r.reason,
          date: r.dueDate,
        }));

      const eligible = results
        .filter((r: any) => r.status === "eligibleNow")
        .map((r: any) => ({
          label: r.vaccineName,
          sub: r.reason,
          date: r.dueDate,
        }));

      const recentDays = 30;
      const recent = (user.vaccines ?? [])
        .filter((v: any) => !!v.lastDoseDate)
        .map((v: any) => ({
          label: v.name,
          sub: "Last dose",
          date: v.lastDoseDate as string,
        }))
        .filter((v: any) => {
          const d = new Date((v.date ?? "") + "T00:00:00").getTime();
          const diffDays = Math.floor(
            (today.getTime() - d) / (1000 * 60 * 60 * 24),
          );
          return diffDays >= 0 && diffDays <= recentDays;
        })
        .sort((a: any, b: any) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));

      setBuckets({ overdue, dueSoon, eligible, recent });

      // 3) generate reminders
      const allowedTypes = new Set(prefsToTypes(prefs));
      const channels = prefsToChannels(prefs);

      const raw = generateReminders(
        results.filter(
          (r: any) =>
            (r.status === "dueSoon" ||
              r.status === "overdue" ||
              r.status === "eligibleNow") &&
            allowedTypes.has(r.status),
        ) as any,
        { leadDays: 7, channels, todayIso },
      );

      // 4) dedupe + send
      const sentKeys = loadSentKeys();
      const { out } = dedupe(raw, sentKeys);

      for (const r of out) {
        const user = users.find((u) => u.id === r.userId);
        if (!user) continue;

        try {
          const smsText = `${r.title}. ${r.body}`;

          const emailSubject = r.title;

          const emailText = [
            `Hi ${user.name},`,
            "",
            `Vaccine Update: ${r.title}`,
            "-----------------------------",
            r.body,
            "",
            "Please contact your clinic if you have any questions.",
          ].join("\n");

          if (r.channel === "sms" && user.phone) {
            await sendSMS(user.phone, smsText);
          }

          if (r.channel === "email" && user.email) {
            await sendEmail(user.email, emailSubject, emailText);
          }
        } catch (e) {
          console.error("Send failed:", e);
        }
      }

      if (out.length > 0) appendToSentReminderLog(out);
      saveSentKeys(sentKeys);

      setActiveReminders(out);

      // 5) history
      const allHistory = loadSentReminderLog().filter(
        (r) => r.userId === userId,
      );
      const activeKeys = new Set(out.map((r) => makeKey(r)));
      const historyOnly = allHistory.filter((r) => !activeKeys.has(makeKey(r)));

      setHistoryReminders(
        historyOnly
          .slice()
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
      );
    };

    run();
  }, [userId, prefs]);

  const user = users.find((u) => u.id === userId)!;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            Vaccine Eligibility & Reminders
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a patient to view vaccine cards + notification history.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <select
          className="border rounded-lg px-3 py-2"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <NotificationPrefsDropdown
          unreadCount={activeReminders.length}
          onPrefsChange={(p) => setPrefs(p)}
        />
      </div>

      {/* Selected patient cards */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MiniBucket
            title="Overdue"
            icon={<AlertTriangle className="h-4 w-4" />}
            items={buckets.overdue}
          />
          <MiniBucket
            title="Due soon"
            icon={<Clock className="h-4 w-4" />}
            items={buckets.dueSoon}
          />
          <MiniBucket
            title="Eligible"
            icon={<CheckCircle2 className="h-4 w-4" />}
            items={buckets.eligible}
          />
          <MiniBucket
            title="Recent"
            icon={<History className="h-4 w-4" />}
            items={buckets.recent}
          />
        </CardContent>
      </Card>

      {/* Notification center for selected user */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">In-App Notification Center</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active ({activeReminders.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                Past / Sent ({historyReminders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              {activeReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No reminders based on current preferences.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeReminders.map((r) => (
                    <ReminderRow key={r.id} r={r} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {historyReminders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No past/sent reminders for this user.
                </p>
              ) : (
                <div className="space-y-2">
                  {historyReminders.map((r) => (
                    <ReminderRow key={r.id} r={r} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

function MiniBucket({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: BucketItem[];
}) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <p className="font-medium">{title}</p>
          </div>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">None</p>
        ) : (
          <div className="space-y-2 max-h-44 overflow-auto pr-1">
            {items.slice(0, 6).map((it, idx) => (
              <div key={idx} className="rounded-md border p-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{it.label}</p>
                  {it.date ? (
                    <Badge variant="outline" className="text-xs">
                      {new Date(it.date + "T00:00:00").toLocaleDateString()}
                    </Badge>
                  ) : null}
                </div>
                {it.sub ? (
                  <p className="text-xs text-muted-foreground">{it.sub}</p>
                ) : null}
              </div>
            ))}
            {items.length > 6 ? (
              <p className="text-xs text-muted-foreground">
                +{items.length - 6} more…
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReminderRow({ r }: { r: Reminder }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium truncate">{r.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {r.vaccineName}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary" className="capitalize">
            {r.channel}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {r.type}
          </Badge>
        </div>
      </div>
      <Separator className="my-2" />
      <p className="text-sm">{r.body}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {new Date(r.createdAt + "T00:00:00").toLocaleDateString()}
      </p>
    </div>
  );
}
