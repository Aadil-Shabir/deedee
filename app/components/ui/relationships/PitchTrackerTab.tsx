import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { toast } from "sonner";
import { Investor } from "@/types/investors";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { forwardRef } from "react";

interface PitchTrackerTabProps {
  investors: Record<string, Investor[]>;
  stages: Array<{ id: string; label: string; count: number }>;
  onDragEnd: (result: DropResult) => void;
  onCardClick: (investor: Investor) => void;
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
  <Card
    ref={ref}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className="bg-gray-800/50 p-4 rounded-lg border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8">
        <img
          src={investor.avatar}
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
));
DraggableCard.displayName = "DraggableCard";

// DroppableStages Component
const DroppableStages = ({
  investors,
  stages,
  onCardClick,
}: {
  investors: Record<string, Investor[]>;
  stages: Array<{ id: string; label: string; count: number }>;
  onCardClick: (investor: Investor) => void;
}) => {
  return (
    <div className="grid grid-cols-6 gap-4">
      {stages.map((stage) => (
        <Droppable 
          key={stage.id} 
          droppableId={stage.id}
          isDropDisabled={false} // Explicitly set to false
          isCombineEnabled={false} // Explicitly set to false
          ignoreContainerClipping={false} // Explicitly set to false
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
              <div className="space-y-3 min-h-[200px]">
                {investors[stage.id]?.map((investor, index) => (
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
                ))}
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
}: PitchTrackerTabProps) {
  // Use React.StrictMode.unstable_AsyncMode to help debug issues
  // with react-beautiful-dnd in React 18
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
          investors={investors}
          stages={stages}
          onCardClick={onCardClick}
        />
      </DragDropContext>
    </div>
  );
}
