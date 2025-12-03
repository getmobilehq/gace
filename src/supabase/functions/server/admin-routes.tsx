import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

/**
 * Admin Routes - User Management
 * WARNING: These routes should be protected in production!
 */

// Delete user by email (for testing/cleanup)
app.post("/delete-user", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    console.log(`[ADMIN] Deleting user: ${email}`);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // First, find the user by email in auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("[ADMIN] Error listing users:", listError);
      return c.json({ error: "Failed to list users", details: listError.message }, 500);
    }

    const userToDelete = users.find((u) => u.email === email);

    if (!userToDelete) {
      console.log(`[ADMIN] User not found in auth: ${email}`);
      // Still try to delete from user_profiles in case of orphaned record
      const { error: profileDeleteError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("email", email);

      if (profileDeleteError) {
        console.error("[ADMIN] Error deleting orphaned profile:", profileDeleteError);
      }

      return c.json({ 
        message: "User not found in auth, but checked for orphaned profile",
        email 
      });
    }

    console.log(`[ADMIN] Found user in auth: ${userToDelete.id}`);

    // Delete from auth (this should cascade delete the profile due to foreign key)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      userToDelete.id
    );

    if (deleteError) {
      console.error("[ADMIN] Error deleting user from auth:", deleteError);
      return c.json({ error: "Failed to delete user", details: deleteError.message }, 500);
    }

    // Also explicitly delete from user_profiles to be safe
    const { error: profileDeleteError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", userToDelete.id);

    if (profileDeleteError) {
      console.error("[ADMIN] Error deleting profile (may already be deleted):", profileDeleteError);
      // Don't return error - profile may have been cascade deleted
    }

    console.log(`[ADMIN] Successfully deleted user: ${email}`);

    return c.json({
      message: "User deleted successfully",
      email,
      userId: userToDelete.id,
    });
  } catch (error: any) {
    console.error("[ADMIN] Unexpected error:", error);
    return c.json({ error: "Internal server error", details: error.message }, 500);
  }
});

// List all users (for debugging)
app.get("/list-users", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("[ADMIN] Error listing users:", error);
      return c.json({ error: "Failed to list users", details: error.message }, 500);
    }

    const userList = users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      user_metadata: u.user_metadata,
    }));

    return c.json({
      count: users.length,
      users: userList,
    });
  } catch (error: any) {
    console.error("[ADMIN] Unexpected error:", error);
    return c.json({ error: "Internal server error", details: error.message }, 500);
  }
});

// Delete ALL users (nuclear option - for testing only!)
app.post("/delete-all-users", async (c) => {
  try {
    console.log("[ADMIN] ⚠️  DELETING ALL USERS ⚠️");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("[ADMIN] Error listing users:", listError);
      return c.json({ error: "Failed to list users", details: listError.message }, 500);
    }

    let deletedCount = 0;
    const errors: any[] = [];

    for (const user of users) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        console.error(`[ADMIN] Failed to delete user ${user.email}:`, deleteError);
        errors.push({ email: user.email, error: deleteError.message });
      } else {
        console.log(`[ADMIN] Deleted user: ${user.email}`);
        deletedCount++;
      }
    }

    // Also clean up user_profiles table
    const { error: profilesError } = await supabase
      .from("user_profiles")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (profilesError) {
      console.error("[ADMIN] Error cleaning up profiles:", profilesError);
    }

    console.log(`[ADMIN] Deleted ${deletedCount} users`);

    return c.json({
      message: `Deleted ${deletedCount} users`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("[ADMIN] Unexpected error:", error);
    return c.json({ error: "Internal server error", details: error.message }, 500);
  }
});

export default app;
