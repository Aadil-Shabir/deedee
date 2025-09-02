"use client";

interface ComingSoonTabProps {
  tabName: string;
}

export function ComingSoonTab({ tabName }: ComingSoonTabProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-zinc-100 mb-3">
          {tabName} Coming Soon
        </h2>
      </div>
    </div>
  );
}
