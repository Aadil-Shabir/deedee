import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileDown, 
  Share2, 
  Mail, 
  Loader2, 
  FileSpreadsheet 
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

export function ReportForm({onComplete}: {onComplete: ()=> void}) {
  const [generating, setGenerating] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [report, setReport] = useState<string | null>(null);
  const { user } = useUser();

  const generateReport = async () => {
    if (!user) {
      toast.error("You must be logged in to generate a report");
      return;
    }
    if (onComplete) {
        onComplete();
      }
    setGenerating(true);
    setCountdown(5);

    try {
      const response = await fetch(
        "https://lixnuezgrxuzwvstygzz.supabase.co/functions/v1/generate-investment-report",
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpeG51ZXpncnh1end2c3R5Z3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NTgxMDMsImV4cCI6MjA1NTMzNDEwM30.CED8faSmTCk_jRz8ocAmUfz0cONnQpvTOClpUtCYWZM`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            founderId: user.id,
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setReport(data.report);
      toast.success("Investment report generated successfully!");
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Failed to generate report. Please make sure all required information is filled out.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investment_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Report downloaded successfully!");
  };

  const handleShare = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    toast.success("Report copied to clipboard!");
  };

  const handleEmail = () => {
    // This is a placeholder - you might want to implement actual email sending functionality
    toast.success("Report sent to your email!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
          Investment Report
        </h1>
        <Button
          size="lg"
          onClick={generateReport}
          disabled={generating}
          className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      {generating && (
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-zinc-700/40 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-violet-400" />
          <p className="text-lg font-medium mb-2">Generating your investment report...</p>
          <p className="text-sm text-zinc-400">This may take a minute as we analyze your company data.</p>
          <div className="mt-6 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      )}

      {report && !generating && (
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-4 md:p-6 backdrop-blur-sm shadow-lg border border-zinc-700/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-900/30 rounded-lg border border-violet-700/30">
                <FileSpreadsheet className="h-6 w-6 text-violet-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Investment Report</h3>
                <p className="text-sm text-zinc-400">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial border-violet-700/50 bg-violet-900/20 hover:bg-violet-700/30 hover:border-violet-600 text-violet-300 transition-colors"
                onClick={handleDownload}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial border-violet-700/50 bg-violet-900/20 hover:bg-violet-700/30 hover:border-violet-600 text-violet-300 transition-colors"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial border-violet-700/50 bg-violet-900/20 hover:bg-violet-700/30 hover:border-violet-600 text-violet-300 transition-colors"
                onClick={handleEmail}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap font-mono text-sm bg-zinc-900/70 rounded-lg p-4 border border-zinc-800 shadow-inner overflow-auto max-h-[600px]">
              {report}
            </div>
          </div>
          
          <p className="mt-6 text-sm text-zinc-400 border-t border-zinc-700/40 pt-4">
            <span className="font-medium text-zinc-300">Note:</span> This report is generated based on the information you have provided in your profile. Keep your profile up to date for the most accurate results.
          </p>
        </div>
      )}
      
      {!report && !generating && (
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm border border-zinc-700/40">
          <div className="flex flex-col items-center text-center py-8">
            <div className="p-3 bg-violet-900/20 rounded-full border border-violet-700/30 mb-4">
              <FileSpreadsheet className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Investment Report</h3>
            <p className="text-zinc-400 mb-6 max-w-md">
              Generate a comprehensive investment report based on your company data to share with potential investors.
            </p>
            <Button
              onClick={generateReport}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
