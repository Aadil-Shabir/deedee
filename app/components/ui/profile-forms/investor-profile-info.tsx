"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";

export default function InvestorProfileInfo() {
  const [investorType, setInvestorType] = useState("myself");
  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-12">
        {/* Investment Preference */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">How do you identify your investment preference?</h2>
          <RadioGroup 
            value={investorType} 
            onValueChange={setInvestorType}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="myself" id="myself" className="border-violet-500" />
              <Label htmlFor="myself" className="text-white">I invest by myself</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="company" id="company" className="border-violet-500" />
              <Label htmlFor="company" className="text-white">I invest via a company</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Bio Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Describe in a few sentences who you are? What do you love?</h2>
            <Check className="text-green-500 w-6 h-6" />
          </div>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#171c2a] text-white border-zinc-700 rounded-lg p-4 min-h-[120px]"
            placeholder="About you"
          />
        </div>
        
        {/* Name Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">What is your first and last name?</h2>
            <Check className="text-green-500 w-6 h-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#171c2a] border-zinc-700 text-white"
              placeholder="First Name"
            />
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#171c2a] border-zinc-700 text-white"
              placeholder="Last Name"
            />
          </div>
        </div>
        
        {/* Profile Picture Upload */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Please upload your profile picture.</h2>
            <Check className="text-green-500 w-6 h-6" />
          </div>
          <div className="flex justify-center">
            <div className="relative rounded-full overflow-hidden w-32 h-32 bg-[#2D3748] flex items-center justify-center cursor-pointer">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-zinc-400 text-sm p-4">
                  Click to upload your profile picture
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Email Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">What is your best e-mail to receive your dealflow?</h2>
            <Check className="text-green-500 w-6 h-6" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#171c2a] border-zinc-700 text-white"
            placeholder="ahmad.ali.000507@gmail.com"
          />
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            className="bg-[#171c2a] border-zinc-700 text-white px-8"
          >
            Back
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 