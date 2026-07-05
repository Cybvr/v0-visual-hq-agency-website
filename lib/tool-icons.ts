import {
  SiAirtable,
  SiBuffer,
  SiCaldotcom,
  SiClaudecode,
  SiGmail,
  SiGoogleads,
  SiGoogleanalytics,
  SiGoogledrive,
  SiGooglesearchconsole,
  SiGooglesheets,
  SiInstagram,
  SiLooker,
  SiMeta,
  SiNextdotjs,
  SiNotion,
  SiFramer,
  SiReact,
  SiSupabase,
  SiFirebase,
  SiVercel,
  SiWebflow,
  SiWordpress,
  SiWoo,
  SiShopify,
  SiSlackware,
  SiWhatsapp,
  SiWoocommerce,
} from "react-icons/si"

export type ToolIconSpec = {
  color: string
  icon?: unknown
  label: string
  textMark?: string
}

const toolIconMap: Record<string, ToolIconSpec[]> = {
  "AI agents": [
    { icon: SiClaudecode, color: "#D97757", label: "Claude Code" },
    { color: "#111111", label: "Codex", textMark: "CX" },
  ],
  Airtable: [{ icon: SiAirtable, color: "#18BFFF", label: "Airtable" }],
  "Cal.com": [{ icon: SiCaldotcom, color: "#111111", label: "Cal.com" }],
  Buffer: [{ icon: SiBuffer, color: "#231F20", label: "Buffer" }],
  Email: [{ icon: SiGmail, color: "#EA4335", label: "Gmail" }],
  "Email / WhatsApp": [
    { icon: SiGmail, color: "#EA4335", label: "Gmail" },
    { icon: SiWhatsapp, color: "#25D366", label: "WhatsApp" },
  ],
  Gmail: [{ icon: SiGmail, color: "#EA4335", label: "Gmail" }],
  "Google Analytics": [{ icon: SiGoogleanalytics, color: "#E37400", label: "Google Analytics" }],
  "Google Drive": [{ icon: SiGoogledrive, color: "#0F9D58", label: "Google Drive" }],
  "Google Sheets": [{ icon: SiGooglesheets, color: "#34A853", label: "Google Sheets" }],
  "Instagram DMs": [{ icon: SiInstagram, color: "#E4405F", label: "Instagram" }],
  "Looker Studio": [{ icon: SiLooker, color: "#4285F4", label: "Looker Studio" }],
  "Meta Ads": [{ icon: SiMeta, color: "#0866FF", label: "Meta" }],
  "Meta Business Suite": [{ icon: SiMeta, color: "#0866FF", label: "Meta" }],
  "Next.js": [{ icon: SiNextdotjs, color: "#111111", label: "Next.js" }],
  Notion: [{ icon: SiNotion, color: "#111111", label: "Notion" }],
  Firebase: [{ icon: SiFirebase, color: "#FFCA28", label: "Firebase" }],
  Framer: [{ icon: SiFramer, color: "#0055FF", label: "Framer" }],
  React: [{ icon: SiReact, color: "#61DAFB", label: "React" }],
  "Search Console": [{ icon: SiGooglesearchconsole, color: "#458CF5", label: "Search Console" }],
  "Shopify / WooCommerce": [
    { icon: SiShopify, color: "#95BF47", label: "Shopify" },
    { icon: SiWoocommerce, color: "#96588A", label: "WooCommerce" },
  ],
  "Slack / WhatsApp": [
    { icon: SiSlackware, color: "#611F69", label: "Slack" },
    { icon: SiWhatsapp, color: "#25D366", label: "WhatsApp" },
  ],
  Supabase: [{ icon: SiSupabase, color: "#3ECF8E", label: "Supabase" }],
  Vercel: [{ icon: SiVercel, color: "#111111", label: "Vercel" }],
  WhatsApp: [{ icon: SiWhatsapp, color: "#25D366", label: "WhatsApp" }],
  Webflow: [{ icon: SiWebflow, color: "#146EF5", label: "Webflow" }],
  WooCommerce: [{ icon: SiWoo, color: "#873EFF", label: "WooCommerce" }],
  WordPress: [{ icon: SiWordpress, color: "#21759B", label: "WordPress" }],
}

export function getToolIconSpecs(tool: string): ToolIconSpec[] {
  return toolIconMap[tool] ?? []
}
