// app/hooks/use-investor-profile.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  getInvestorProfile, 
  upsertInvestorProfile, 
  uploadProfileImage,
  type InvestorProfileData
} from '@/actions/actions.investor-profile'
import { toast } from 'sonner'

// Hook for fetching investor profile
export function useInvestorProfileQuery() {
  return useQuery({
    queryKey: ['investorProfile'],
    queryFn: async () => {
      const { data, error } = await getInvestorProfile()
      
      if (error) {
        throw new Error(error)
      }
      
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  })
}

// Hook for updating investor profile
export function useUpdateInvestorProfile() {
  return useMutation({
    mutationFn: async (data: InvestorProfileData) => {
      const { success, error } = await upsertInvestorProfile(data)
      
      if (error) {
        throw new Error(error)
      }
      
      return success
    },
    onSuccess: () => {
      // Make the toast more visible and descriptive
      toast.success('Profile saved successfully!', {
        duration: 5000,
        id: 'profile-update-success',
        description: 'Your investor profile information has been updated'
      });
    },
    onError: (error: Error) => {
      // Provide better error feedback
      toast.error('Failed to update profile', {
        duration: 5000,
        id: 'profile-update-error',
        description: error.message || 'Please try again or contact support'
      });
    }
  });
}

// Optimistic update version of useUpdateInvestorProfile
export function useUpdateInvestorProfileOptimistic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: InvestorProfileData) => {
      const { success, error } = await upsertInvestorProfile(data)
      
      if (error) {
        throw new Error(error)
      }
      
      return success
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['investorProfile'] })
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['investorProfile'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['investorProfile'], (oldData: any) => {
        return {
          ...oldData,
          ...newData
        }
      })
      
      // Return a context object with the snapshot
      return { previousData }
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousData) {
        queryClient.setQueryData(['investorProfile'], context.previousData)
      }
      toast.error('Failed to update profile. Changes reverted.')
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['investorProfile'] })
    },
    onSuccess: () => {
      toast.success('Profile updated successfully')
    }
  })
}

// Hook for uploading profile image
export function useUploadProfileImage() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { url, error } = await uploadProfileImage(formData)
      
      if (error) {
        throw new Error(error)
      }
      
      return url
    },
    onSuccess: (url) => {
      // Make the toast more visible and descriptive
      toast.success('Profile image uploaded!', {
        duration: 5000,
        id: 'profile-image-upload-success',
        description: 'Your profile image has been updated successfully'
      });
      return url;
    },
    onError: (error: Error) => {
      // Provide better error feedback
      toast.error('Failed to upload image', {
        duration: 5000,
        id: 'profile-image-upload-error',
        description: error.message || 'Please try again with a different image'
      });
    }
  });
}