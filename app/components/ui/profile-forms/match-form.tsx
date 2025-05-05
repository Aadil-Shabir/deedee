"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Check, 
  Loader2, 
  Target, 
  UserPlus, 
  ChevronDown, 
  CheckSquare,
  ExternalLink,
  Info,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface MatchStats {
  totalScanned: number;
  totalMatches: number;
  ultimateMatches: number;
  superMatches: number;
  topMatches: number;
}

interface Investor {
  name: string;
  location: string;
  matchRate: number;
}

export function MatchForm({onComplete}: {onComplete: ()=> void}) {
  const [loading, setLoading] = useState(false);
  const [matchComplete, setMatchComplete] = useState(false);
  const [stats, setStats] = useState<MatchStats>({
    totalScanned: 0,
    totalMatches: 0,
    ultimateMatches: 0,
    superMatches: 0,
    topMatches: 0
  });
  const [topInvestors, setTopInvestors] = useState<Investor[]>([]);
  const [currentCheck, setCurrentCheck] = useState("");
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const simulateMatching = async () => {
    setLoading(true);
    setMatchComplete(false);
    setCurrentCheck("Initializing match scan...");
    setProgress(0);

    const checks = [
      "Checking geography...",
      "Analyzing industry fit...",
      "Reviewing latest activity...",
      "Evaluating investor types...",
      "Calculating match scores..."
    ];

    for (let i = 0; i < checks.length; i++) {
      const check = checks[i];
      setCurrentCheck(check);
      setProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setStats({
      totalScanned: 13480,
      totalMatches: 1300,
      ultimateMatches: 60,
      superMatches: 440,
      topMatches: 800
    });

    setTopInvestors([
      { name: "Sequoia Capital", location: "United States", matchRate: 95 },
      { name: "East Ventures", location: "Indonesia", matchRate: 92 },
      { name: "Golden Gate Ventures", location: "Singapore", matchRate: 88 },
      { name: "Alpha JWC", location: "Indonesia", matchRate: 87 },
      { name: "Accel", location: "United States", matchRate: 85 },
      { name: "B Capital", location: "Singapore", matchRate: 84 },
      { name: "Openspace", location: "Singapore", matchRate: 82 },
      { name: "Vertex Ventures", location: "Singapore", matchRate: 81 },
      { name: "500 Global", location: "United States", matchRate: 80 },
      { name: "Monk's Hill Ventures", location: "Singapore", matchRate: 79 }
    ]);

    setLoading(false);
    setMatchComplete(true);
    toast.success("Match analysis complete!");
    if (onComplete) {
        onComplete();
      }
  };

  const handleInvestorSelect = (investorName: string) => {
    setSelectedInvestors(prev => 
      prev.includes(investorName)
        ? prev.filter(name => name !== investorName)
        : [...prev, investorName]
    );
  };

  const handleAddToRelations = (investorName: string) => {
    toast.success(`Added ${investorName} to relations`);
  };

  const handleBulkAddToRelations = () => {
    if (selectedInvestors.length === 0) {
      toast.error("Please select investors first");
      return;
    }
    toast.success(`Added ${selectedInvestors.length} investors to relations`);
    setSelectedInvestors([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
          Investor Match
        </h1>
        <Button
          size="lg"
          onClick={simulateMatching}
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentCheck}
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Find Matches
            </>
          )}
        </Button>
      </div>

      {loading && (
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-zinc-700/40 shadow-md">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 bg-violet-900/20 rounded-full border border-violet-700/30 mb-4">
              <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Matching in Progress</h3>
            <p className="text-zinc-400 mb-6">
              Scanning our database for the best investor matches for your startup.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">{currentCheck}</span>
              <span className="text-zinc-300 font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gradient-to-r from-violet-600 to-indigo-600" />
          </div>
        </div>
      )}

      {matchComplete && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 text-center backdrop-blur-sm shadow-md border border-zinc-700/40">
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalScanned.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Investors Scanned</div>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 text-center backdrop-blur-sm shadow-md border border-zinc-700/40">
              <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalMatches.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Total Matches</div>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 text-center backdrop-blur-sm shadow-md border border-violet-700/20">
              <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">{stats.ultimateMatches}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Ultimate (90%+)</div>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 text-center backdrop-blur-sm shadow-md border border-pink-700/20">
              <div className="text-xl sm:text-2xl font-bold text-pink-500">{stats.superMatches}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Super (75-90%)</div>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 text-center backdrop-blur-sm shadow-md border border-blue-700/20">
              <div className="text-xl sm:text-2xl font-bold text-blue-500">{stats.topMatches}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Top (60-75%)</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 md:p-6 backdrop-blur-sm shadow-md border border-zinc-700/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-white">Top Matching Investors</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-2 text-zinc-400 hover:text-zinc-200">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 border-zinc-700">
                      <p className="max-w-xs text-sm">
                        These investors match your startups profile based on industry, stage, traction, and funding needs.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {selectedInvestors.length > 0 && (
                <Button
                  onClick={handleBulkAddToRelations}
                  variant="outline"
                  size="sm"
                  className="border-violet-700/50 bg-violet-900/20 hover:bg-violet-700/30 hover:border-violet-600 text-violet-300 transition-colors"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Selected ({selectedInvestors.length})
                </Button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="w-12 text-zinc-400">
                      <Checkbox 
                        checked={selectedInvestors.length === topInvestors.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedInvestors(topInvestors.map(inv => inv.name));
                          } else {
                            setSelectedInvestors([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="text-zinc-400">Investor</TableHead>
                    <TableHead className="text-zinc-400">Location</TableHead>
                    <TableHead className="text-zinc-400">Match Rate</TableHead>
                    <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topInvestors.map((investor, index) => (
                    <TableRow key={index} className="border-zinc-800 hover:bg-zinc-800/40 transition-colors">
                      <TableCell>
                        <Checkbox 
                          checked={selectedInvestors.includes(investor.name)}
                          onCheckedChange={() => handleInvestorSelect(investor.name)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">{investor.name}</TableCell>
                      <TableCell className="text-zinc-300">{investor.location}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          investor.matchRate >= 90 
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                            : investor.matchRate >= 75 
                              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {investor.matchRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddToRelations(investor.name)}
                            className="hover:bg-violet-500/20 hover:text-violet-300"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.success(`Opening ${investor.name}'s profile`)}
                            className="hover:bg-violet-500/20 hover:text-violet-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                >
                  See More Matches <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-zinc-900 text-white border-zinc-700">
                <div className="max-w-4xl mx-auto py-6">
                  <h3 className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
                    Select a Package to View More Matches
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-zinc-700/40 transition-all hover:shadow-lg hover:scale-[1.01] duration-200">
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Basic Match</h3>
                      <p className="text-zinc-400 mb-4">Access to matches 60-75%</p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">View top matches</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">Basic analytics</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 transition-colors">
                        Select Basic
                      </Button>
                    </div>

                    <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-pink-500/20 transition-all hover:shadow-lg hover:scale-[1.01] duration-200">
                      <h3 className="text-lg font-semibold text-pink-400 mb-2">Super Match</h3>
                      <p className="text-zinc-400 mb-4">Access to matches 75-90%</p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">All Basic features</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">Priority matching</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">Advanced analytics</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white transition-colors">
                        Select Super
                      </Button>
                    </div>

                    <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-violet-500/20 transition-all hover:shadow-lg hover:scale-[1.01] duration-200">
                      <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300 mb-2">Ultimate Match</h3>
                      <p className="text-zinc-400 mb-4">Access to matches 90%+</p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">All Super features</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">Direct introductions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-zinc-300">Personal match advisor</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200">
                        Select Ultimate
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div>
            <Tabs defaultValue="subscriptions" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-zinc-900/70 border border-zinc-800">
                <TabsTrigger value="subscriptions" className="data-[state=active]:bg-violet-900/20 data-[state=active]:text-violet-300">
                  Subscription Plans
                </TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-violet-900/20 data-[state=active]:text-violet-300">
                  Feature Comparison
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscriptions" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-zinc-700/40 transition-all hover:shadow-lg hover:scale-[1.01] duration-200">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Basic Match</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-2xl font-bold text-white">$99</span>
                      <span className="text-zinc-400 ml-1">/month</span>
                    </div>
                    <p className="text-zinc-400 mb-4">Access to matches 60-75%</p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">View top matches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">Basic analytics</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Subscribe
                    </Button>
                  </div>

                  <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-pink-500/20 transition-all hover:shadow-lg hover:scale-[1.01] duration-200">
                    <h3 className="text-lg font-semibold text-pink-400 mb-2">Super Match</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-2xl font-bold text-white">$199</span>
                      <span className="text-zinc-400 ml-1">/month</span>
                    </div>
                    <p className="text-zinc-400 mb-4">Access to matches 75-90%</p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">All Basic features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">Priority matching</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">Advanced analytics</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white">
                      Subscribe
                    </Button>
                  </div>

                  <div className="relative bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-violet-500/20 transition-all hover:shadow-lg hover:scale-[1.01] duration-200">
                    <div className="absolute -top-3 right-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                      RECOMMENDED
                    </div>
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300 mb-2">Ultimate Match</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-2xl font-bold text-white">$349</span>
                      <span className="text-zinc-400 ml-1">/month</span>
                    </div>
                    <p className="text-zinc-400 mb-4">Access to matches 90%+</p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">All Super features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">Direct introductions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-zinc-300">Personal match advisor</span>
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-400 w-1/3">Feature</TableHead>
                        <TableHead className="text-zinc-400 text-center">Basic</TableHead>
                        <TableHead className="text-zinc-400 text-center">Super</TableHead>
                        <TableHead className="text-zinc-400 text-center">Ultimate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-zinc-800">
                        <TableCell className="font-medium">Match Access</TableCell>
                        <TableCell className="text-center">60-75%</TableCell>
                        <TableCell className="text-center">75-90%</TableCell>
                        <TableCell className="text-center">90%+</TableCell>
                      </TableRow>
                      <TableRow className="border-zinc-800">
                        <TableCell className="font-medium">Analytics Dashboard</TableCell>
                        <TableCell className="text-center">Basic</TableCell>
                        <TableCell className="text-center">Advanced</TableCell>
                        <TableCell className="text-center">Premium</TableCell>
                      </TableRow>
                      <TableRow className="border-zinc-800">
                        <TableCell className="font-medium">Direct Introductions</TableCell>
                        <TableCell className="text-center text-zinc-500">—</TableCell>
                        <TableCell className="text-center">Limited (3/mo)</TableCell>
                        <TableCell className="text-center">Unlimited</TableCell>
                      </TableRow>
                      <TableRow className="border-zinc-800">
                        <TableCell className="font-medium">Personal Advisor</TableCell>
                        <TableCell className="text-center text-zinc-500">—</TableCell>
                        <TableCell className="text-center text-zinc-500">—</TableCell>
                        <TableCell className="text-center text-emerald-400"><Check className="h-4 w-4 mx-auto" /></TableCell>
                      </TableRow>
                      <TableRow className="border-zinc-800">
                        <TableCell className="font-medium">Pitch Deck Review</TableCell>
                        <TableCell className="text-center text-zinc-500">—</TableCell>
                        <TableCell className="text-center">1/month</TableCell>
                        <TableCell className="text-center">Unlimited</TableCell>
                      </TableRow>
                      <TableRow className="border-zinc-800">
                        <TableCell className="font-medium">Investor Reports</TableCell>
                        <TableCell className="text-center">Monthly</TableCell>
                        <TableCell className="text-center">Weekly</TableCell>
                        <TableCell className="text-center">Real-time</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200"
                    onClick={() => toast.success("Taking you to subscription page")}
                  >
                    Choose a Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {!loading && !matchComplete && (
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-8 backdrop-blur-sm shadow-md border border-zinc-700/40 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-violet-900/20 rounded-full flex items-center justify-center">
            <Target className="h-8 w-8 text-violet-300" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-200 mb-2">Find Your Investor Matches</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-6">
            Our AI-powered matching system will analyze your company profile and find 
            the most suitable investors based on your industry, stage, and funding needs.
          </p>
          <Button 
            onClick={simulateMatching}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200"
            size="lg"
          >
            <Target className="mr-2 h-4 w-4" />
            Start Matching
          </Button>
        </div>
      )}
    </div>
  );
}
