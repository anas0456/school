import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user exists
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found", user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("API: Error checking user:", error);
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("API: Attempting to delete user with id:", id);
    console.log("API: Supabase client initialized:", !!supabaseAdmin);

    // First check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    console.log("API: Existing user check:", { existingUser, fetchError });

    if (fetchError || !existingUser) {
      console.error("API: User not found:", fetchError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Now try to delete - use direct SQL to bypass any RLS issues
    const { data: deleteData, error } = await supabaseAdmin.rpc('delete_user', { user_id: id });
    
    console.log("API: Delete result via RPC:", { deleteData, error });

    // If RPC fails, try direct delete
    if (error) {
      console.log("API: RPC failed, trying direct delete:", error);
      
      const { error: directError } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", id);
      
      console.log("API: Direct delete result:", { directError });
      
      if (directError) {
        console.error("API: Direct delete error:", directError);
        return NextResponse.json({ error: directError.message }, { status: 500 });
      }
    }

    // Verify deletion
    const { data: verifyUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    
    console.log("API: Verification - user still exists?", !!verifyUser);

    console.log("API: User deleted successfully, id:", id);
    return NextResponse.json({ success: true, deleted: !verifyUser });
  } catch (error) {
    console.error("API: Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
