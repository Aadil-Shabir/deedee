
import { Button } from "@/components/ui/button";
import { PageVisit } from "@/types/visits";
import { ProfileVisitsTable } from "./ProfileVisitsTable";
import { useProfileVisits } from "./hooks/useProfileVisits";

interface ProfileVisitsTabProps {
  pageVisits: PageVisit[];
  onVisitClick: (
    investorName: string,
    company: string,
    pageName: string,
    visitCount: number
  ) => void;
}

export const ProfileVisitsTab = ({
  pageVisits: initialPageVisits,
  onVisitClick,
}: ProfileVisitsTabProps) => {
  const { pageVisits, isLoading, fetchVisitData } = useProfileVisits(initialPageVisits);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Profile Visits</h2>
        <Button 
          variant="outline" 
          onClick={() => fetchVisitData()}
          disabled={isLoading}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      <ProfileVisitsTable 
        pageVisits={pageVisits} 
        onVisitClick={onVisitClick} 
      />
    </div>
  );
};
