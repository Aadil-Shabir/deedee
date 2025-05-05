
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { Mail, Phone, Globe, Eye, Calendar, BanknoteIcon } from "lucide-react";
  import { Avatar } from "@/components/ui/avatar";
  
  interface Visit {
    page: string;
    count: number;
    lastVisit: string;
  }
  
  interface InvestorDetails {
    id: string;
    name: string;
    company: string;
    type: string;
    score: number;
    email: string;
    phone: string;
    website: string;
    stage: string;
    avatar: string;
    visits: Visit[];
    investment_type?: string | null;
    investment_amount?: number | null;
    reservation_amount?: number | null;
    interest_rate?: number | null;
    valuation?: number | null;
    num_shares?: number | null;
    share_price?: number | null;
  }
  
  interface InvestorDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    investor: InvestorDetails | null;
  }
  
  export function InvestorDetailsDialog({
    open,
    onOpenChange,
    investor,
  }: InvestorDetailsDialogProps) {
    if (!investor) return null;
  
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  
    const hasInvestmentDetails = investor.investment_amount && investor.investment_amount > 0;
    const hasReservationDetails = investor.reservation_amount && investor.reservation_amount > 0;
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Investor Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <img src={investor.avatar} alt={investor.name} />
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{investor.name}</h2>
                <p className="text-gray-400">{investor.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-profile-purple">{investor.type}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{investor.stage} Stage</span>
                </div>
              </div>
              <div className="ml-auto">
                <div className="text-3xl font-bold text-profile-purple">{investor.score}</div>
                <div className="text-sm text-gray-400">Profile Score</div>
              </div>
            </div>
  
            {/* Contact Information */}
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${investor.email}`} className="text-profile-purple hover:underline">
                    {investor.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{investor.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href={investor.website} target="_blank" rel="noopener noreferrer" className="text-profile-purple hover:underline">
                    {investor.website}
                  </a>
                </div>
              </div>
            </div>
  
            {/* Investment Details */}
            {(hasInvestmentDetails || hasReservationDetails) && (
              <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-4">Financial Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  {hasReservationDetails && (
                    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BanknoteIcon className="w-5 h-5 text-pink-500" />
                        <span>Reservation Amount</span>
                      </div>
                      <span className="text-pink-500 font-semibold">
                        {formatCurrency(investor.reservation_amount as number)}
                      </span>
                    </div>
                  )}
  
                  {hasInvestmentDetails && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BanknoteIcon className="w-5 h-5 text-profile-purple" />
                          <span>Investment Amount</span>
                        </div>
                        <span className="text-profile-purple font-semibold">
                          {formatCurrency(investor.investment_amount as number)}
                        </span>
                      </div>
  
                      {investor.investment_type === 'debt' && investor.interest_rate && (
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <span>Interest Rate</span>
                          <span className="text-profile-purple font-semibold">
                            {investor.interest_rate}%
                          </span>
                        </div>
                      )}
  
                      {investor.investment_type === 'equity' && (
                        <>
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <span>Valuation</span>
                            <span className="text-profile-purple font-semibold">
                              {formatCurrency(investor.valuation || 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <span>Number of Shares</span>
                            <span className="text-profile-purple font-semibold">
                              {investor.num_shares?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <span>Share Price</span>
                            <span className="text-profile-purple font-semibold">
                              {formatCurrency(investor.share_price || 0)}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
  
            {/* Profile Visits */}
            <div className="space-y-4">
              <h3 className="font-semibold">Profile Visit History</h3>
              <ScrollArea className="h-[200px] rounded-md border border-gray-700 p-4">
                <div className="space-y-4">
                  {investor.visits.map((visit, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{visit.page}</div>
                        <div className="text-sm text-gray-400">
                          Last visit: {visit.lastVisit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-profile-purple font-semibold">
                          {visit.count} visits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  