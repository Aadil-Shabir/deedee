"use client";

import { Input } from "@/components/ui/input";

interface AchievementInputProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}

export function AchievementInput({ achievements, onChange }: AchievementInputProps) {
  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    onChange(newAchievements);
  };

  return (
    <div className="space-y-3">
      {achievements.map((achievement, index) => (
        <Input
          key={index}
          value={achievement}
          onChange={(e) => handleAchievementChange(index, e.target.value)}
          placeholder={`Achievement ${index + 1}`}
          className="bg-zinc-800/50 border-zinc-700 focus:border-primary"
        />
      ))}
    </div>
  );
} 