"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddTeamMemberDialog } from "../team-forms/add-team-member-dialog";
import { TeamMemberData } from "../team-forms/team-member-form";
import { Plus, X, Users, Award, ChevronRight } from "lucide-react";

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

  const handleTeamMemberAdd = (data: TeamMemberData) => {
    const newMember: TeamMember = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleTeamMemberRemove = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
                Your leadership team is a critical factor for investors. Strong, diverse teams with complementary skills are more likely to succeed.
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
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="text-zinc-200">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="two" id="two" />
                <Label htmlFor="two" className="text-zinc-200">Yes, we are with 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="more" id="more" />
                <Label htmlFor="more" className="text-zinc-200">We are with more than 2</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-zinc-200">Leadership Team</Label>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {teamMembers.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 relative"
                >
                  <button
                    onClick={() => handleTeamMemberRemove(member.id)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="space-y-1">
                    <h3 className="font-medium text-zinc-200">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-zinc-400">{member.function}</p>
                    <p className="text-sm text-zinc-400">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-200">
            Founders Diversity <span className="text-primary">*</span>
          </Label>
          <RadioGroup value={diversity} onValueChange={setDiversity}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="women" id="women" />
                <Label htmlFor="women" className="text-zinc-200">Only women</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="men" id="men" />
                <Label htmlFor="men" className="text-zinc-200">Only men</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed" className="text-zinc-200">Mixed</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label className="text-zinc-200">
            Please share 3 notable TEAM achievements <span className="text-primary">*</span>
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
        <Button className="bg-primary hover:bg-primary/90">
          Save & Next
        </Button>
      </div>

      <AddTeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleTeamMemberAdd}
      />
    </div>
  );
} 