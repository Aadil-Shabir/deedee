"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMemberFormProps {
  onSubmit: (data: TeamMemberData) => void;
  onCancel?: () => void;
}

export interface TeamMemberData {
  firstName: string;
  lastName: string;
  email: string;
  function: string;
  linkedinUrl: string;
}

const functionOptions = [
  "CEO",
  "CTO",
  "CFO",
  "COO",
  "CMO",
  "Head of Product",
  "Head of Engineering",
  "Head of Design",
  "Head of Sales",
  "Head of Marketing",
  "Software Engineer",
  "Product Manager",
  "Designer",
  "Other"
];

export function TeamMemberForm({ onSubmit, onCancel }: TeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMemberData>({
    firstName: "",
    lastName: "",
    email: "",
    function: "",
    linkedinUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            className="bg-zinc-800/50 border-zinc-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            className="bg-zinc-800/50 border-zinc-700"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-zinc-800/50 border-zinc-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="function">Function *</Label>
        <Select
          value={formData.function}
          onValueChange={(value) =>
            setFormData({ ...formData, function: value })
          }
        >
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
            <SelectValue placeholder="Select a function" />
          </SelectTrigger>
          <SelectContent>
            {functionOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile Link</Label>
        <Input
          id="linkedin"
          placeholder="LinkedIn Profile URL"
          value={formData.linkedinUrl}
          onChange={(e) =>
            setFormData({ ...formData, linkedinUrl: e.target.value })
          }
          className="bg-zinc-800/50 border-zinc-700"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Add Team Member
        </Button>
      </div>
    </form>
  );
} 