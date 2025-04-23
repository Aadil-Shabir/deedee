"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddTeamMemberDialog } from "../team-forms/add-team-member-dialog";
import { TeamMemberData } from "../team-forms/team-member-form";
import { TeamMembersList } from "../team-forms/team-members-list";
import { Plus, Users, Award, ChevronRight } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast-provider";
import {
  getTeamInfo,
  saveTeamInfo,
  getTeamMembers,
  addTeamMember,
  deleteTeamMember,
} from "@/actions/actions.teams";

interface TeamMember extends TeamMemberData {
  id: string;
}

export function TeamInfo() {
  const [teamSize, setTeamSize] = useState("");
  const [coFounders, setCoFounders] = useState("no");
  const [diversity, setDiversity] = useState("mixed");
  const [achievements, setAchievements] = useState<string[]>(["", "", ""]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { user, loading } = useUser();
  const { toast } = useToast();

  // Load team info
  useEffect(() => {
    async function loadTeamData() {
      if (!user) return;

      try {
        const result = await getTeamInfo(user.id);

        if (result.success && result.data) {
          const data = result.data;

          setTeamSize(data.teamSize.toString());
          setCoFounders(data.hasCoFounders);
          setDiversity(data.foundersDiversity);
          setAchievements(data.achievements);
        }
      } catch (error) {
        console.error("Error loading team data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!loading) {
      loadTeamData();
    }
  }, [user, loading]);

  // Load team members separately
  useEffect(() => {
    async function loadTeamMembers() {
      if (!user) return;

      try {
        const result = await getTeamMembers(user.id);

        if (result.success) {
          setTeamMembers(result.data);
        }
      } catch (error) {
        console.error("Error loading team members:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    }

    if (!loading) {
      loadTeamMembers();
    }
  }, [user, loading]);

  // Handle adding a team member
  const handleTeamMemberAdd = async (data: TeamMemberData) => {
    if (!user) return;

    try {
      // Call the server action to add the team member
      const result = await addTeamMember(user.id, data);

      if (result.success && result.data) {
        // Add the new member to the local state
        const newMember: TeamMember = {
          ...data,
          id: result.data.id,
        };

        setTeamMembers([newMember, ...teamMembers]);

        // Close the dialog
        setDialogOpen(false);

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

    try {
      const result = await deleteTeamMember(user.id, id);

      if (result.success) {
        setTeamMembers(teamMembers.filter((member) => member.id !== id));

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
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
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

    setIsSaving(true);

    try {
      const result = await saveTeamInfo(user.id, {
        teamSize: parseInt(teamSize) || 0,
        hasCoFounders: coFounders as "no" | "two" | "more",
        foundersDiversity: diversity as "women" | "men" | "mixed",
        achievements,
      });

      if (result.success) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-zinc-400">Loading team information...</div>
        </div>
      ) : (
        <>
          {/* Team Page Header - no changes */}
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
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 max-w-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-200">
                Do you have co-founders? <span className="text-primary">*</span>
              </Label>
              <RadioGroup value={coFounders} onValueChange={setCoFounders}>
                {/* Existing radio buttons - no changes */}
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

            {/* Team Members Section - updated with our new component */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-zinc-200">Leadership Team</Label>
                <Button
                  type="button" // Make sure it doesn't submit the form
                  onClick={() => setDialogOpen(true)}
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
                  members={teamMembers}
                  onDelete={handleTeamMemberRemove}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-200">
                Founders Diversity <span className="text-primary">*</span>
              </Label>
              <RadioGroup value={diversity} onValueChange={setDiversity}>
                {/* Existing radio buttons - no changes */}
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
                  value={achievement}
                  onChange={(e) => handleAchievementChange(index, e.target.value)}
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
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleTeamMemberAdd}
      />
    </form>
  );
}