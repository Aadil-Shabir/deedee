"use client";

import { Calendar, Eye, File, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  type: "view" | "document" | "message";
  company: string;
  description: string;
  timestamp: string;
}

interface ActionItem {
  id: string;
  task: string;
  dueDate: string;
  status: "due today" | "due tomorrow" | "overdue" | string;
}

interface ActivityDashboardProps {
  activities: Activity[];
  actionItems: ActionItem[];
}

export function ActivityDashboard({ activities, actionItems }: ActivityDashboardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="h-5 w-5 text-violet-400" />;
      case "document":
        return <File className="h-5 w-5 text-blue-400" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-400" />;
      default:
        return <Eye className="h-5 w-5 text-violet-400" />;
    }
  };

  const getDueStyle = (status: string) => {
    if (status === "due today") return "text-red-500";
    if (status === "due tomorrow") return "text-yellow-500";
    if (status === "overdue") return "text-red-600 font-medium";
    return "text-blue-500";
  };

  const formatDueLabel = (status: string) => {
    if (status === "due today") return "Due today";
    if (status === "due tomorrow") return "Due tomorrow";
    if (status.startsWith("Due")) return status;
    return `Due ${status}`;
  };

  return (
    <Card className="bg-[#0f1729] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-400">
          Activity Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-zinc-200">Recent Activity</h3>
              <a href="#" className="text-sm text-violet-400 hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex gap-3 items-start py-3 border-b border-zinc-800/50 last:border-0"
                >
                  <div className="bg-zinc-800/80 p-2 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white">
                        {activity.company} {activity.description}
                      </h4>
                      <span className="text-xs text-zinc-500">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-zinc-200">Action Items</h3>
              <span className="text-sm px-2 py-1 rounded-full bg-violet-500/20 text-violet-300">
                {actionItems.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {actionItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-zinc-800/50 last:border-0"
                >
                  <h4 className="font-medium text-white">{item.task}</h4>
                  <span className={`text-sm ${getDueStyle(item.status)}`}>
                    {formatDueLabel(item.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 