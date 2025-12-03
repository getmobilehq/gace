import { getSupabaseClient } from "./client";

const BUCKET_NAME = "make-b5fd51b8-documents";

export class StorageService {
  private supabase = getSupabaseClient();

  /**
   * Initialize storage bucket (call on app startup)
   */
  async initializeBucket() {
    try {
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucketExists = buckets?.some(
        (bucket) => bucket.name === BUCKET_NAME
      );

      if (!bucketExists) {
        const { error } = await this.supabase.storage.createBucket(
          BUCKET_NAME,
          {
            public: false,
            fileSizeLimit: 52428800, // 50MB
          }
        );
        if (error) throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error initializing bucket:", error);
      return { success: false, error };
    }
  }

  /**
   * Upload a document
   */
  async uploadDocument(
    userId: string,
    file: File,
    documentType: string
  ): Promise<{ path: string | null; error: any }> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await this.supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Store document metadata in database
      await this.supabase.from("documents").insert({
        user_id: userId,
        document_type: documentType,
        file_name: file.name,
        file_path: data.path,
        file_size: file.size,
        upload_date: new Date().toISOString(),
        ocr_status: "pending",
      });

      return { path: data.path, error: null };
    } catch (error) {
      console.error("Error uploading document:", error);
      return { path: null, error };
    }
  }

  /**
   * Get signed URL for a document
   */
  async getDocumentUrl(filePath: string, expiresIn: number = 3600) {
    try {
      const { data, error } = await this.supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return { url: data.signedUrl, error: null };
    } catch (error) {
      console.error("Error getting signed URL:", error);
      return { url: null, error };
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(filePath: string) {
    try {
      const { error } = await this.supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;

      // Delete from database
      await this.supabase.from("documents").delete().eq("file_path", filePath);

      return { error: null };
    } catch (error) {
      console.error("Error deleting document:", error);
      return { error };
    }
  }

  /**
   * List user documents
   */
  async listUserDocuments(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .order("upload_date", { ascending: false });

      if (error) throw error;
      return { documents: data, error: null };
    } catch (error) {
      console.error("Error listing documents:", error);
      return { documents: [], error };
    }
  }
}

// Singleton instance
export const storageService = new StorageService();
