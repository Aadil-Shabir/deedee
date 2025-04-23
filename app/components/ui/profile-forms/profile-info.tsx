"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Upload } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast-provider";
import { uploadProfilePicture, saveProfileInfo } from "@/lib/supabase-utils";
import { createClient } from "@/supabase/supabase";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const supabase = createClient();

const ProfileInfo = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyFunction, setCompanyFunction] = useState("");
  const [email, setEmail] = useState("");
  const [founderType, setFounderType] = useState("first-time");
  const [calendarLink, setCalendarLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [tempImageFile, setTempImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, loading } = useUser();
  const { toast } = useToast();
  
  // console.log('user', user);  
  // Load user profile data
  useEffect(() => {
    async function loadProfileData() {
      console.log("jfnjsdnfjn")
      if (!user) return;
      
      setIsLoading(true);
      try {
        // console.log('user', user);
        
        // Get profile data from supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // console.log('profileData', profileData);

        // For new users with no profile data, populate from metadata
        if (!profileData) {
          const metadata = user.user_metadata;
          if (metadata) {
            setFirstName(metadata.first_name || '');
            setLastName(metadata.last_name || '');
            setEmail(user.email || '');
          }
        }
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile data:', profileError);
        }
        
        if (profileData) {
          console.log('profileData found');
          console.log(profileData.profile_picture_url);
          // Set form fields with profile data
          setFirstName(profileData.first_name || '');
          setLastName(profileData.last_name || '');
          setEmail(profileData.email || user.email || '');
          setCompanyFunction(profileData.company_function || '');
          setFounderType(profileData.founder_type || 'first-time');
          setCalendarLink(profileData.calendar_link || '');
          setInstagramLink(profileData.instagram_link || '');
          setLinkedinUrl(profileData.linkedin_url || '');
          
          if (profileData.profile_picture_url) {
            setProfilePicture(profileData.profile_picture_url);
          }
        }
      } catch (error) {
        console.error('Error in loadProfileData:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
      loadProfileData();
    
  }, [user]);

  // Handle file selection for cropping
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the image temporarily for cropping
        setTempImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the cropped image from the ImageCropper component
  const handleCroppedImage = (croppedImage: string) => {
    setProfilePicture(croppedImage);
    setTempImageFile(null);
  };

  // Close the cropper without saving
  const handleCloseCropper = () => {
    setTempImageFile(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your profile",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload profile picture if exists and is a new image
      let profilePictureUrl = undefined;
      
      if (profilePicture) {
        // Check if the profile picture needs to be uploaded
        if (profilePicture.startsWith('data:')) {
          // It's a data URL, so upload it to Supabase storage
          console.log('Uploading new profile picture...');
          profilePictureUrl = await uploadProfilePicture(user, profilePicture);
          
          if (!profilePictureUrl) {
            toast({
              title: "Warning",
              description: "Failed to upload profile picture, but continuing with profile save",
              variant: "destructive"
            });
          } else {
            console.log('Successfully uploaded profile picture:', profilePictureUrl.substring(0, 50) + '...');
          }
        } else if (profilePicture.includes('supabase')) {
          // It's already a Supabase URL, keep using it
          profilePictureUrl = profilePicture;
          console.log('Using existing Supabase profile picture URL');
        } else {
          // It's some other URL (like localhost), don't use it
          console.log('Ignoring non-Supabase URL:', profilePicture.substring(0, 30) + '...');
          profilePictureUrl = null;
        }
      }

      // Get the user's current role from user metadata
      const userRole = user.user_metadata?.role || 'founder';

      // Save profile data to Supabase
      const result = await saveProfileInfo(user, {
        first_name: firstName,
        last_name: lastName,
        company_function: companyFunction,
        founder_type: founderType,
        calendar_link: calendarLink,
        profile_picture_url: profilePictureUrl as string,
        instagram_link: instagramLink,
        linkedin_url: linkedinUrl,
        role: userRole // Keep the existing role
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Your profile has been updated successfully",
          variant: "success"
        });
        
        // If we uploaded a new profile picture, update the state with the new URL
        if (profilePictureUrl && profilePictureUrl !== profilePicture) {
          setProfilePicture(profilePictureUrl);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to save profile information",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Fndata = [
    "COO", "CEO", "CMO", "CTO","Advisor", "VP", "Founder", "Co-Founder", "Other"
  ]
  return (
    <>
      {tempImageFile && (
        <ImageCropper
          image={tempImageFile}
          aspect={1}
          circularCrop={true}
          onCropComplete={handleCroppedImage}
          onClose={handleCloseCropper}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8 animate-slideIn">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-400 border-t-transparent"></div>
            <p className="mt-4 text-sm text-zinc-400">Loading profile data...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border">
                  {profilePicture ? (
                    
                    <Image 
                      src={profilePicture} 
                      alt="Profile picture" 
                      className="object-cover"
                      fill
                      onClick={() => document.getElementById('profile-picture')?.click()}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-violet-950/20 text-muted-foreground">
                      <Button onClick={() => document.getElementById('profile-picture')?.click()}>
                      <span className="text-xs">No image</span>
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <Label 
                    htmlFor="profile-picture" 
                    className="mb-2 inline-block cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="mr-2 inline-block h-4 w-4" />
                    Upload Picture
                  </Label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="function">Function <span className="text-red-500">*</span></Label>
                <Select
                  value={companyFunction}
                  onValueChange={setCompanyFunction}
                  required
                >
                  <SelectTrigger   id="function">
                    <SelectValue placeholder="Select your function..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                       <SelectLabel>Common Functions</SelectLabel>
                      {Fndata.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-3 font-medium">Founder Type <span className="text-red-500">*</span></h3>
                <RadioGroup value={founderType} onValueChange={setFounderType} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="first-time" id="first-time" />
                    <Label htmlFor="first-time">First time founder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="serial-no-exit" id="serial-no-exit" />
                    <Label htmlFor="serial-no-exit">Serial entrepreneur without exit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="serial-with-exit" id="serial-with-exit" />
                    <Label htmlFor="serial-with-exit">Serial entrepreneur with exit</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendar">Calendar Link (optional)</Label>
                <Input
                  id="calendar"
                  value={calendarLink}
                  onChange={(e) => setCalendarLink(e.target.value)}
                  placeholder="https://calendly.com/yourusername"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">Social Profiles</h3>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram <span className="text-red-500">*</span></Label>
                <Input
                  id="instagram"
                  value={instagramLink}
                  onChange={(e) => setInstagramLink(e.target.value)}
                  placeholder="https://instagram.com/username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    size="icon"
                    className="border-violet-500 bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 hover:text-violet-500"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Button type="button" variant="outline">
                Back
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default ProfileInfo; 