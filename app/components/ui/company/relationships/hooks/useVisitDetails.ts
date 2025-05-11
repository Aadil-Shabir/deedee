
import { useState } from "react";
import { Visit } from "@/types/visits";

interface VisitDetailsState {
  open: boolean;
  investorName: string;
  company: string;
  pageName: string;
  visits: Visit[];
}

const defaultVisitDetails: VisitDetailsState = {
  open: false,
  investorName: "",
  company: "",
  pageName: "",
  visits: []
};

export function useVisitDetails() {
  const [visitDetails, setVisitDetails] = useState<VisitDetailsState>(defaultVisitDetails);

  const handleVisitClick = (
    investorName: string,
    company: string,
    pageName: string,
    visitCount: number
  ) => {
    const mockVisitData: Visit[] = Array.from({ length: visitCount }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString(),
      duration: `${Math.floor(Math.random() * 10) + 1} minutes`,
      source: "Direct visit"
    }));

    setVisitDetails({
      open: true,
      investorName,
      company,
      pageName,
      visits: mockVisitData,
    });
  };

  return {
    visitDetails,
    setVisitDetails,
    handleVisitClick
  };
}
