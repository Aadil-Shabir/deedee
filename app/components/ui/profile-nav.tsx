import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Profile", href: "/company/profile" },
  { label: "Business", href: "/company/business" },
  { label: "Team", href: "/company/team" },
  { label: "Fundraising", href: "/company/fundraising" },
  { label: "Traction", href: "/company/traction" },
  { label: "Stack", href: "/company/stack" },
  { label: "Promote", href: "/company/promote" },
  { label: "Reports", href: "/company/reports" },
  { label: "Reviews", href: "/company/reviews" },
  { label: "Match", href: "/company/match" },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-zinc-800">
      <nav className="flex space-x-4 px-4 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`py-4 px-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary border-b-2 border-primary"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 