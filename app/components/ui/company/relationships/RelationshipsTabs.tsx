
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PlayCircle, Download } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface RelationshipsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  mode: string;
  onModeChange: (mode: string) => void;
  children: React.ReactNode;
}

export function RelationshipsTabs({
  activeTab,
  onTabChange,
  mode,
  onModeChange,
  children
}: RelationshipsTabsProps) {
  return (
    <Tabs defaultValue="pitchtracker" value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList className="h-14 w-fit justify-start space-x-2 bg-transparent">
          <TabsTrigger
            value="pitchtracker"
            className={`rounded-lg px-4 py-2 text-base transition-all ${
              activeTab === "pitchtracker"
                ? "bg-pink-500 text-white"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
          >
            PitchTracker
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className={`rounded-lg px-4 py-2 text-base transition-all ${
              activeTab === "contacts"
                ? "bg-pink-500 text-white"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="profile-visits"
            className={`rounded-lg px-4 py-2 text-base transition-all ${
              activeTab === "profile-visits"
                ? "bg-pink-500 text-white"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
          >
            Profile Visits
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-profile-purple hover:bg-gray-800 hover:text-profile-purple-light flex items-center gap-1"
            title="Download Chrome Extension"
          >
            <span>Chrome Extension</span>
            <Download className="h-5 w-5" />
          </Button>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-800/50"
              >
                <PlayCircle className="w-6 h-6 text-profile-purple hover:text-profile-purple/90" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-80 bg-gray-900 border-gray-800"
              side="bottom"
            >
              <div className="space-y-2">
                <img
                  src="/placeholder.svg"
                  alt="PitchTracker Tutorial"
                  className="w-full h-40 object-cover rounded-lg mb-2 bg-gray-800"
                />
                <h4 className="font-semibold text-white">How to use PitchTracker</h4>
                <p className="text-sm text-gray-400">
                  Watch this quick tutorial to learn how to manage your investor pipeline effectively. Drag and drop investors between stages to track their progress.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Fan mode</span>
            <Switch
              checked={mode === "fund"}
              onCheckedChange={(checked) => onModeChange(checked ? "fund" : "fan")}
              className="bg-gray-700"
            />
            <span className="text-sm text-gray-400">Fund mode</span>
          </div>
        </div>
      </div>

      {children}
    </Tabs>
  );
}
