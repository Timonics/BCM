import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MembersService } from "@/services/members.service";
import { MembersFilters, MembersOnboardCredentials, UpdateMemberCredentials } from "@/types/members.types";
import { toast } from "sonner";

// Query keys for React Query caching
export const membersKeys = {
  all: ["members"] as const,
  lists: () => [...membersKeys.all, "list"] as const,
  list: (filters?: MembersFilters) => [...membersKeys.lists(), filters] as const,
  details: () => [...membersKeys.all, "detail"] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
  overview: () => [...membersKeys.all, "overview"] as const,
};

export const useMembers = (filters?: MembersFilters) => {
  return useQuery({
    queryKey: membersKeys.list(filters),
    queryFn: async () => {
      const response = await MembersService.getMembers(filters);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch members");
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMember = (memberId: string) => {
  return useQuery({
    queryKey: membersKeys.detail(memberId),
    queryFn: async () => {
      const response = await MembersService.getMember(memberId);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch member");
      }
      
      return response.data;
    },
    enabled: !!memberId, // Only run if memberId exists
    staleTime: 5 * 60 * 1000,
  });
};

export const useMembersOverview = () => {
  return useQuery({
    queryKey: membersKeys.overview(),
    queryFn: async () => {
      const response = await MembersService.getOverview();
      
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch overview");
      }
      
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (credentials: MembersOnboardCredentials) => {
      const response = await MembersService.createMember(credentials);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to create member");
      }
      
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate and refetch members list
        queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
        queryClient.invalidateQueries({ queryKey: membersKeys.overview() });
        
        // Show success toast
        toast.success(
          `Member ${response.data.firstName} ${response.data.surname} created successfully!`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create member");
    },
  });

  return {
    createMember: mutation.mutate,
    createMemberAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: mutation.error,
    isCreateSuccess: mutation.isSuccess,
  };
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ 
      memberId, 
      credentials 
    }: { 
      memberId: string; 
      credentials: UpdateMemberCredentials;
    }) => {
      const response = await MembersService.updateMember(memberId, credentials);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update member");
      }
      
      return response;
    },
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Invalidate both the list and the specific member
        queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
        queryClient.invalidateQueries({ queryKey: membersKeys.detail(variables.memberId) });
        queryClient.invalidateQueries({ queryKey: membersKeys.overview() });
        
        // Update the member in cache
        queryClient.setQueryData(membersKeys.detail(variables.memberId), response.data);
        
        // Show success toast
        toast.success(
          `Member ${response.data.firstName} ${response.data.surname} updated successfully!`
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member");
    },
  });

  return {
    updateMember: mutation.mutate,
    updateMemberAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
    isUpdateSuccess: mutation.isSuccess,
  };
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await MembersService.deleteMember(memberId);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete member");
      }
      
      return response;
    },
    onSuccess: (_, memberId) => {
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: membersKeys.overview() });
      
      // Remove the deleted member from cache
      queryClient.removeQueries({ queryKey: membersKeys.detail(memberId) });
      
      // Show success toast
      toast.success("Member deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete member");
    },
  });

  return {
    deleteMember: mutation.mutate,
    deleteMemberAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
    isDeleteSuccess: mutation.isSuccess,
  };
};

export const useImportMembers = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ fileBase64, filename }: { fileBase64: string; filename: string }) => {
      const response = await MembersService.importMembers(fileBase64, filename);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to import members");
      }
      
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate members list and overview
        queryClient.invalidateQueries({ queryKey: membersKeys.lists() });
        queryClient.invalidateQueries({ queryKey: membersKeys.overview() });
        
        // Show success toast with import statistics
        toast.success(
          `Import completed: ${response.data.success} successful, ${response.data.failed} failed`
        );
        
        // Show errors if any
        if (response.data.errors && response.data.errors.length > 0) {
          console.error("Import errors:", response.data.errors);
          toast.error(`${response.data.errors.length} errors occurred during import`);
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to import members");
    },
  });

  return {
    importMembers: mutation.mutate,
    importMembersAsync: mutation.mutateAsync,
    isImporting: mutation.isPending,
    importError: mutation.error,
    isImportSuccess: mutation.isSuccess,
    importData: mutation.data,
  };
};

export const useExportMembers = () => {
  const mutation = useMutation({
    mutationFn: async (filters?: MembersFilters) => {
      const response = await MembersService.exportMembers(filters);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to export members");
      }
      
      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Create download link for the blob
        const blob = response.data as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `members_export_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        // Show success toast
        toast.success("Members exported successfully!");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to export members");
    },
  });

  return {
    exportMembers: mutation.mutate,
    exportMembersAsync: mutation.mutateAsync,
    isExporting: mutation.isPending,
    exportError: mutation.error,
    isExportSuccess: mutation.isSuccess,
  };
};