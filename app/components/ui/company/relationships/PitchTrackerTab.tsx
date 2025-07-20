'use client';

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { toast } from "sonner";
import { Investor } from "@/types/investors";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { forwardRef } from "react";

interface PitchTrackerTabProps {
  investors: Record<string, Investor[]>;
  stages: Array<{ id: string; label: string; count: number }>;
  onDragEnd: (result: DropResult) => void;
  onCardClick: (investor: Investor) => void;
  isLoading?: boolean;
}

// DraggableCard Component
const DraggableCard = forwardRef<
  HTMLDivElement,
  {
    investor: Investor;
    provided: any;
    onClick: () => void;
  }
>(({ investor, provided, onClick }, ref) => (
  <div
    ref={ref}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    onClick={onClick}
    className="mb-3" // Add margin bottom to create spacing between cards
  >
    <Card
      className="bg-gray-800/50 p-4 rounded-lg border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <img
            src={investor.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(investor.name)}`}
            alt={investor.name}
            className="object-cover"
          />
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium truncate">{investor.name}</p>
            <span className="text-sm text-profile-purple">
              {investor.score}
            </span>
          </div>
          {investor.company && (
            <p className="text-sm text-gray-400 truncate">
              {investor.company}
            </p>
          )}
          {investor.type && (
            <p className="text-xs text-gray-500">{investor.type}</p>
          )}
          {investor.date && (
            <p className="text-xs text-gray-500 mt-2">
              {investor.date}
            </p>
          )}
        </div>
      </div>
    </Card>
  </div>
));
DraggableCard.displayName = "DraggableCard";

// Loading placeholder component
const LoadingPlaceholder = () => (
  <div className="flex items-center justify-center h-40">
    <Loader2 className="w-6 h-6 text-profile-purple animate-spin" />
  </div>
);

// EmptyStage component
const EmptyStage = () => (
  <div className="flex flex-col items-center justify-center h-24 border border-dashed border-gray-700 rounded-lg p-4">
    <p className="text-xs text-gray-500">Drag investors here</p>
  </div>
);

// DroppableStages Component - Fixed to return JSX properly
const DroppableStages = ({
  investors,
  stages,
  onCardClick,
  isLoading,
}: {
  investors: Record<string, Investor[]>;
  stages: Array<{ id: string; label: string; count: number }>;
  onCardClick: (investor: Investor) => void;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{stage.label}</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs">
                0
              </span>
            </div>
            <LoadingPlaceholder />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4">
      {stages.map((stage) => (
        <Droppable 
          key={stage.id} 
          droppableId={stage.id}
          // Remove any potentially problematic props
          // isDropDisabled={undefined} <-- This was likely causing the issue
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{stage.label}</h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs">
                  {investors[stage.id]?.length || 0}
                </span>
              </div>
              <div className="space-y-1 min-h-[200px]">
                {Array.isArray(investors[stage.id]) && investors[stage.id].length > 0 ? (
                  investors[stage.id].map((investor, index) => (
                    <Draggable
                      key={investor.id}
                      draggableId={investor.id}
                      index={index}
                    >
                      {(provided) => (
                        <DraggableCard
                          ref={provided.innerRef}
                          provided={provided}
                          investor={investor}
                          onClick={() => onCardClick(investor)}
                        />
                      )}
                    </Draggable>
                  ))
                ) : (
                  <EmptyStage />
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

// Main Component: PitchTrackerTab
export function PitchTrackerTab({ 
  investors, 
  stages, 
  onDragEnd, 
  onCardClick,
  isLoading = false // Provide default value
}: PitchTrackerTabProps) {
  // Ensure investors object has all the required keys
  const ensuredInvestors = React.useMemo(() => {
    const result = { ...investors };
    // Initialize all stage arrays if they don't exist
    stages.forEach(stage => {
      if (!result[stage.id]) {
        result[stage.id] = [];
      }
    });
    return result;
  }, [investors, stages]);

  return (
    <div className="relative">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 right-0 rounded-full hover:bg-gray-800/50"
          >
            <Video className="w-7 h-7 text-profile-purple hover:text-profile-purple/90" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-80 bg-gray-900 border-gray-800"
          side="bottom"
          align="end"
        >
          <div className="space-y-2">
            <img
              src="/placeholder.svg"
              alt="PitchTracker Tutorial"
              className="w-full h-40 object-cover rounded-lg mb-2 bg-gray-800"
            />
            <h4 className="font-semibold text-white">
              How to use PitchTracker
            </h4>
            <p className="text-sm text-gray-400">
              Watch this quick tutorial to learn how to manage your investor
              pipeline effectively. Drag and drop investors between stages to
              track their progress.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      <DragDropContext onDragEnd={onDragEnd}>
        <DroppableStages
          investors={ensuredInvestors}
          stages={stages}
          onCardClick={onCardClick}
          isLoading={isLoading}
        />
      </DragDropContext>
    </div>
  );
}