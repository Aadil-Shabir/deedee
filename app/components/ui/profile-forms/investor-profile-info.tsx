"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Loader2 } from "lucide-react";
import { getInvestorProfile, type InvestorProfileData } from "@/actions/actions.investor-profile";
import { useUpdateInvestorProfile, useUploadProfileImage } from "@/hooks/query-hooks/use-investorProfile";
import { toast } from "sonner";
import { createClient } from "@/supabase/supabase";

export default function InvestorProfileInfo() {
  // Form state
  const [investorType, setInvestorType] = useState("myself");
  const [bio, setBio] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed to false by default

  // TanStack Query hooks
  const { mutate: updateProfile, isPending } = useUpdateInvestorProfile();
  const { mutate: uploadImage, isPending: isUploading } = useUploadProfileImage();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getInvestorProfile();
        if (error) {
          toast.error(error);
          return;
        }
        
        if (data) {
          setInvestorType(data.investment_preference || "myself");
          setBio(data.about || "");
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setEmail(data.email || "");
          
          if (data.profile_image_url) {
            setProfilePicture(data.profile_image_url);
            setPreviewUrl(data.profile_image_url); // Add this line to set preview URL
            console.log("Loaded profile image from DB:", data.profile_image_url);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle profile picture change
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show file preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Create FormData for server action
    const formData = new FormData();
    formData.append("file", file);

    // Upload using the mutation hook
    uploadImage(formData, {
      onSuccess: (url) => {
        if (url) {
          console.log("Image uploaded successfully, URL:", url);
          setProfilePicture(url);
          
          // IMPORTANT: Save the new URL to the database immediately
          const updatedProfile: InvestorProfileData = {
            investment_preference: investorType,
            about: bio,
            first_name: firstName,
            last_name: lastName,
            email: email,
            profile_image_url: url, // Use the new URL
          };
          
          console.log("Updating profile with image URL:", updatedProfile.profile_image_url);
          
          // Update database with the new URL
          updateProfile(updatedProfile, {
            onSuccess: () => {
              console.log("Profile updated with new image URL");
              toast.success("Profile image updated successfully");
            },
            onError: (error) => {
              console.error("Failed to update profile with new image:", error);
              toast.error("Failed to update profile with new image");
            }
          });
        }
      },
      onError: (error) => {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
      }
    });
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: InvestorProfileData = {
      investment_preference: investorType,
      about: bio,
      first_name: firstName,
      last_name: lastName,
      email: email,
      profile_image_url: profilePicture,
    };

    // Update using the mutation hook
    updateProfile(formData);
  };

  useEffect(() => {
    const debugInfo = async () => {

      const supabase = await createClient(); 
      // Check current auth state
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log("Current auth user:", user.id);
        
        // Check raw database state
        const { data, error } = await supabase
          .from('investor_profiles')
          .select('*');
          
        console.log("Raw database state:", data);
        if (error) console.error("Database query error:", error);
      } else {
        console.log("No authenticated user found");
      }
    };
    
    debugInfo();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="space-y-12">
        {/* Investment Preference */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            How do you identify your investment preference?
          </h2>
          <RadioGroup
            value={investorType}
            onValueChange={setInvestorType}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="myself"
                id="myself"
                className="border-violet-500"
              />
              <Label htmlFor="myself" className="text-white">
                I invest by myself
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="company"
                id="company"
                className="border-violet-500"
              />
              <Label htmlFor="company" className="text-white">
                I invest via a company
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Bio Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Describe in a few sentences who you are? What do you love?
            </h2>
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
            <h2 className="text-xl font-semibold text-white">
              What is your first and last name?
            </h2>
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
            <h2 className="text-xl font-semibold text-white">
              Please upload your profile picture.
            </h2>
            <Check className="text-green-500 w-6 h-6" />
          </div>
          <div className="flex justify-center">
            <div className="relative rounded-full overflow-hidden w-32 h-32 bg-[#2D3748] flex items-center justify-center cursor-pointer">
              {isUploading ? (
                <div className="flex items-center justify-center h-full w-full">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", previewUrl);
                    e.currentTarget.src = "/placeholder-avatar.png"; // Fallback image
                  }}
                />
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
                disabled={isUploading}
              />
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              What is your best e-mail to receive your dealflow?
            </h2>
            <Check className="text-green-500 w-6 h-6" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#171c2a] border-zinc-700 text-white"
            placeholder="email@example.com"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            className="bg-[#171c2a] border-zinc-700 text-white px-8"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
            disabled={isPending || isUploading}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}