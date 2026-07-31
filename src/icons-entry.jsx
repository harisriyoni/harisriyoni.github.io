import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  BookOpenText,
  Briefcase,
  Check,
  Code2,
  Command,
  CreditCard,
  Download,
  FileCode2,
  GitBranch,
  Grid3X3,
  House,
  Kanban,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MoonStar,
  Package,
  Phone,
  Sparkles,
  SquareCode,
  Sun,
  UserRound,
  Users,
  X
} from "lucide-react";

function BrandGithub({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>;
}

function BrandLinkedin({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.57V8.99H3.56v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" /></svg>;
}

const icons = {
  arrowUp: ArrowUp,
  arrowUpRight: ArrowUpRight,
  badgeCheck: BadgeCheck,
  bookOpenText: BookOpenText,
  briefcase: Briefcase,
  check: Check,
  code2: Code2,
  command: Command,
  creditCard: CreditCard,
  download: Download,
  fileCode2: FileCode2,
  git: GitBranch,
  github: BrandGithub,
  grid3x3: Grid3X3,
  house: House,
  kanban: Kanban,
  lightbulb: Lightbulb,
  linkedin: BrandLinkedin,
  mail: Mail,
  mapPin: MapPin,
  menu: Menu,
  messageCircle: MessageCircle,
  moonStar: MoonStar,
  package: Package,
  phone: Phone,
  sparkles: Sparkles,
  squareCode: SquareCode,
  sun: Sun,
  userRound: UserRound,
  users: Users,
  x: X
};

function IconSlot({ node }) {
  const [name, setName] = useState(node.dataset.icon || "sparkles");

  useEffect(() => {
    const observer = new MutationObserver(() => setName(node.dataset.icon || "sparkles"));
    observer.observe(node, { attributes: true, attributeFilter: ["data-icon"] });
    return () => observer.disconnect();
  }, [node]);

  const Icon = icons[name] || Sparkles;
  return <Icon aria-hidden="true" className={node.dataset.iconClass || undefined} strokeWidth={1.9} />;
}

document.querySelectorAll("[data-icon]").forEach((node) => {
  createRoot(node).render(<IconSlot node={node} />);
});
