"use client";

import { Calendar, CalendarCheck, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpdateType {
  type: "Monthly Update" | "Funding Milestone" | "Partnership";
  color: string;
}

const updateTypes: Record<string, UpdateType> = {
  "Monthly Update": { type: "Monthly Update", color: "text-violet-400" },
  "Funding Milestone": { type: "Funding Milestone", color: "text-violet-400" },
  "Partnership": { type: "Partnership", color: "text-blue-400" },
};

interface CompanyUpdate {
  id: string;
  company: string;
  date: string;
  updateType: string;
  content: string;
}

interface Meeting {
  id: string;
  title: string;
  company: string;
  date: string;
  time: string;
}

interface FounderEngagementProps {
  updates: CompanyUpdate[];
  meetings: Meeting[];
}

export function FounderEngagement({ updates, meetings }: FounderEngagementProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="bg-[#0f1729] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-pink-400">
          Founder Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {updates.map((update) => (
                <div 
                  key={update.id}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{update.company}</h4>
                    <span className="text-xs text-zinc-400">{update.date}</span>
                  </div>
                  <div className="mb-3">
                    <span className={`text-sm ${updateTypes[update.updateType]?.color || 'text-zinc-400'}`}>
                      {update.updateType}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm">{update.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Upcoming Meetings</h3>
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div 
                  key={meeting.id}
                  className="flex gap-3 items-center py-3"
                >
                  <div className="bg-violet-800/50 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{meeting.title}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-zinc-400">{meeting.company}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-sm text-zinc-400">{meeting.date}, {meeting.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 