
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

/**
 * Uploads an image to Supabase Storage from a blob URL or File
 * @param blobUrlOrFile - The blob URL or File object to upload
 * @param projectId - The project ID to associate with the image
 * @returns A promise that resolves to the permanent URL of the uploaded image
 */
export const uploadFormLogo = async (
  blobUrlOrFile: string | File,
  projectId: string
): Promise<string | null> => {
  try {
    if (!projectId) {
      console.error("No project ID provided for logo upload");
      return null;
    }

    console.log(`Starting logo upload process for project ${projectId}`);
    console.log(`Input: ${typeof blobUrlOrFile === 'string' ? blobUrlOrFile : blobUrlOrFile.name}`);

    let file: File;
    
    // If we have a blob URL, we need to fetch it and convert to a File
    if (typeof blobUrlOrFile === 'string' && blobUrlOrFile.startsWith('blob:')) {
      console.log("Converting blob URL to File:", blobUrlOrFile);
      
      try {
        // Try to fetch the blob URL, but it may fail if accessing from a different browser session
        const response = await fetch(blobUrlOrFile);
        if (!response.ok) {
          throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        file = new File([blob], `logo-${nanoid()}.png`, { type: blob.type || 'image/png' });
        console.log("Successfully converted blob to File:", file.name, file.size, "bytes");
      } catch (error) {
        console.error("Error converting blob URL to File:", error);
        // Rethrow the error to be handled by the caller
        throw error;
      }
    } else if (blobUrlOrFile instanceof File) {
      file = blobUrlOrFile;
      console.log("Using provided File object:", file.name, file.size, "bytes");
    } else {
      // If it's a regular URL (not a blob), just return it
      if (typeof blobUrlOrFile === 'string' && !blobUrlOrFile.startsWith('blob:')) {
        console.log("Using existing URL (not a blob):", blobUrlOrFile);
        return blobUrlOrFile;
      }
      console.error("Invalid input for logo upload");
      return null;
    }

    // Generate a unique file name to prevent overwriting
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${projectId}/logo-${nanoid()}.${fileExt}`;

    console.log("Uploading logo to Supabase Storage:", fileName);

    // Check if the form-assets bucket exists, create it if it doesn't
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      if (bucketsError.message.includes("Permission denied")) {
        console.error("PERMISSION DENIED: Your user doesn't have permission to list buckets");
      }
    } else {
      console.log("Available buckets:", buckets?.map(b => b.name).join(', ') || 'none');
      const formAssetsBucketExists = buckets?.some(bucket => bucket.name === 'form-assets');
      
      if (!formAssetsBucketExists) {
        console.log("Creating 'form-assets' bucket...");
        const { error: createBucketError } = await supabase.storage.createBucket('form-assets', {
          public: true
        });
        
        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          if (createBucketError.message.includes("Permission denied")) {
            console.error("PERMISSION DENIED: Your user doesn't have permission to create buckets");
          }
        } else {
          console.log("Created 'form-assets' bucket successfully");
        }
      }
    }

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('form-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      if (uploadError.message.includes("Permission denied")) {
        console.error("PERMISSION DENIED: Your user doesn't have permission to upload to this bucket");
      }
      return null;
    }

    console.log("Upload successful:", uploadData);

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('form-assets')
      .getPublicUrl(fileName);

    console.log("Generated public URL:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in logo upload process:", error);
    return null; // Return null instead of throwing to handle errors more gracefully
  }
};
