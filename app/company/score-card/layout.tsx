import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Score Card | Metrics Dashboard",
  description: "View your company's performance metrics and growth indicators.",
};

export default function ScoreCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 pb-16">
      {children}
    </div>
  );
}