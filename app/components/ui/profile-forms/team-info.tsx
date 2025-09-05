"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { AddTeamMemberDialog } from "../team-forms/add-team-member-dialog";
// import { TeamMemberData } from "../team-forms/team-member-form";
// import { TeamMembersList } from "../team-forms/team-members-list";
import { Plus, Users, Award, ChevronRight } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast-provider";
import { useCompanyContext } from "@/context/company-context";
import {
  getTeamInfo,
  saveTeamInfo,
  getTeamMembers,
  addTeamMember,
  deleteTeamMember,
} from "@/actions/actions.teams";
import { TeamMemberData } from "../company/team-forms/team-member-form";
import { TeamMembersList } from "../company/team-forms/team-members-list";
import { AddTeamMemberDialog } from "../company/team-forms/add-team-member-dialog";
import {
  useTeamMembers,
  useTeamInfo,
} from "@/hooks/query-hooks/use-team-queries";

interface TeamMember extends TeamMemberData {
  id: string;
}

export function TeamInfo({ onComplete }: { onComplete: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user, loading } = useUser();
  const { toast } = useToast();

  // Get the activeCompanyId from the CompanyContext
  const { activeCompanyId } = useCompanyContext();

  const {
    data: teamMembersData,
    isLoading: isLoadingMembers,
    error: teamMembersError,
    refetch: refetchTeamMembers,
  } = useTeamMembers(user?.id || "", activeCompanyId || "");

  const {
    data: teamInfoData,
    isLoading,
    error: teamInfoError,
    refetch: refetchTeamInfo
  } = useTeamInfo(user?.id || "", activeCompanyId || "");

  // Use activeCompanyId from context if available, otherwise fall back to prop
  const companyId = activeCompanyId;

  // Log the company ID being used
  const teamSize =
    teamInfoData?.success && teamInfoData.data
      ? teamInfoData.data.teamSize || ""
      : "";
  const coFounders =
    teamInfoData?.success && teamInfoData.data
      ? teamInfoData.data.hasCoFounders || "no"
      : "no";
  const diversity =
    teamInfoData?.success && teamInfoData.data
      ? teamInfoData.data.foundersDiversity || "mixed"
      : "mixed";
  const achievements =
    teamInfoData?.success && teamInfoData.data
      ? teamInfoData.data.achievements || ["", "", ""]
      : ["", "", ""];

  const teamSizeRef = useRef<HTMLInputElement>(null);
  const coFoundersRef = useRef<string>(coFounders);
  const diversityRef = useRef<string>(diversity);
  const achievementsRef = useRef<string[]>(achievements);

  // Handle adding a team member
  const handleTeamMemberAdd = async (data: TeamMemberData) => {
    if (!user) return;
    if (!companyId) {
      toast({
        title: "Error",
        description: "No company selected. Please select a company first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the server action to add the team member
      const result = await addTeamMember(user.id, data, companyId);

      if (result.success && result.data) {
        refetchTeamMembers();

        // Close the dialog
        setIsDialogOpen(false);

        toast({
          title: "Success",
          description: "Team member added successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle removing a team member
  const handleTeamMemberRemove = async (id: string) => {
    if (!user) return;
    if (!companyId) {
      toast({
        title: "Error",
        description: "No company selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await deleteTeamMember(user.id, id, companyId);

      if (result.success) {
        refetchTeamMembers();

        toast({
          title: "Success",
          description: "Team member removed successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...achievementsRef.current];
    newAchievements[index] = value;
    achievementsRef.current = newAchievements;
  };

  // Save team info only (not team members)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save team information",
        variant: "destructive",
      });
      return;
    }

    if (!companyId) {
      toast({
        title: "Error",
        description: "No company selected. Please select a company first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const currentTeamSize = teamSizeRef.current?.value || "";
      const currentCoFounders = coFoundersRef.current;
      const currentDiversity = diversityRef.current;
      const currentAchievements = achievementsRef.current;

      const result = await saveTeamInfo(
        user.id,
        {
          teamSize: parseInt(currentTeamSize) || 0,
          hasCoFounders: currentCoFounders as "no" | "two" | "more",
          foundersDiversity: currentDiversity as "women" | "men" | "mixed",
          achievements: currentAchievements,
        },
        companyId
      );

      if (result.success) {
        refetchTeamInfo();
        toast({
          title: "Success",
          description: "Team information saved successfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save team information",
          variant: "destructive",
        });
      }
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving team info:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show company selection message if no company is selected
  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="bg-primary/20 p-4 rounded-full">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center text-zinc-200">
          No Company Selected
        </h2>
        <p className="text-zinc-400 text-center max-w-md">
          Please select a company from your company list to manage its team
          information.
        </p>
        <Button
          className="mt-4 bg-primary hover:bg-primary/90"
          onClick={() => (window.location.href = "/company/profile")}
        >
          Go to Company Selection
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-zinc-400">Loading team information...</div>
        </div>
      ) : (
        <>
          {/* Team Page Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-primary">
                Team
              </h1>
            </div>
            <div className="bg-zinc-800/30 backdrop-blur-sm rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-zinc-200">
                    Your leadership team is a critical factor for investors.
                    Strong, diverse teams with complementary skills are more
                    likely to succeed.
                  </p>
                  <div className="flex items-center text-primary/80 text-sm mt-2 hover:text-primary transition-colors cursor-pointer">
                    <span>Learn how to highlight your team strengths</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-zinc-200">
                How big is your team? <span className="text-primary">*</span>
              </Label>
              <Input
                id="teamSize"
                type="number"
                ref={teamSizeRef}
                defaultValue={teamSize}
                className="bg-zinc-800/50 border-zinc-700 max-w-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-200">
                Do you have co-founders? <span className="text-primary">*</span>
              </Label>
              <RadioGroup
                defaultValue={coFounders}
                onValueChange={(value) => {
                  coFoundersRef.current = value;
                }}
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="text-zinc-200">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="two" id="two" />
                    <Label htmlFor="two" className="text-zinc-200">
                      Yes, we are with 2
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more" id="more" />
                    <Label htmlFor="more" className="text-zinc-200">
                      We are with more than 2
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Team Members Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-200">Leadership Team</Label>
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              {isLoadingMembers ? (
                <div className="py-10 flex justify-center">
                  <div className="text-zinc-400">Loading team members...</div>
                </div>
              ) : (
                <TeamMembersList
                  members={teamMembersData?.success ? teamMembersData.data : []}
                  onDelete={handleTeamMemberRemove}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-200">
                Founders Diversity <span className="text-primary">*</span>
              </Label>
              <RadioGroup
                defaultValue={diversity}
                onValueChange={(value) => {
                  diversityRef.current = value;
                }}
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="women" id="women" />
                    <Label htmlFor="women" className="text-zinc-200">
                      Only women
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="men" id="men" />
                    <Label htmlFor="men" className="text-zinc-200">
                      Only men
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed" className="text-zinc-200">
                      Mixed
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-zinc-200">
                Please share 3 notable TEAM achievements{" "}
                <span className="text-primary">*</span>
              </Label>
              {achievements.map((achievement, index) => (
                <Input
                  key={index}
                  defaultValue={achievement}
                  onChange={(e) =>
                    handleAchievementChange(index, e.target.value)
                  }
                  placeholder={`Achievement ${index + 1}`}
                  className="bg-zinc-800/50 border-zinc-700"
                  required
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save & Next"}
            </Button>
          </div>
        </>
      )}

      <AddTeamMemberDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleTeamMemberAdd}
      />
    </form>
  );
}
