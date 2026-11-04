/** Single place where every collection name lives. */
export const COLL = {
  settings: "settings",
  admins: "admins",
  services: "services",
  packages: "packages",
  team: "team",
  testimonials: "testimonials",
  faqs: "faqs",
  articles: "articles",
  appointments: "appointments",
  messages: "messages",
} as const;

/** Collections the admin panel can create/edit/delete rows in. */
export const EDITABLE = [
  "team",
  "services",
  "packages",
  "testimonials",
  "faqs",
  "articles",
] as const;

export type EditableCollection = (typeof EDITABLE)[number];

export const INBOX = ["appointments", "messages"] as const;
export type InboxCollection = (typeof INBOX)[number];

export function isEditable(name: string): name is EditableCollection {
  return (EDITABLE as readonly string[]).includes(name);
}

export function isInbox(name: string): name is InboxCollection {
  return (INBOX as readonly string[]).includes(name);
}
