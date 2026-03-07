import { NotificationPrefs } from "../../components/ui/NotificationPrefsDropdown";

export type Channel = "email" | "sms" | "inApp";
export type ReminderType = "dueSoon" | "overdue" | "eligibleNow";

export function prefsToChannels(p: NotificationPrefs): Channel[] {
  const channels: Channel[] = [];
  if (p.emailNotifications) channels.push("email");
  if (p.smsNotifications) channels.push("sms");
  if (p.pushNotifications) channels.push("inApp");
  return channels;
}

export function prefsToTypes(p: NotificationPrefs): ReminderType[] {
  const types: ReminderType[] = [];
  if (p.comments) types.push("dueSoon");
  if (p.mentions) types.push("overdue");
  if (p.updates) types.push("eligibleNow");
  return types;
}
