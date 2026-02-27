import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: homework, error } = await supabase
      .from("homework")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching homework:", error);
      return NextResponse.json(
        { error: "Failed to fetch homework" },
        { status: 500 }
      );
    }

    return NextResponse.json({ homework });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, due_date, grade, course_id } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { data: homework, error } = await supabase
      .from("homework")
      .insert({
        title,
        description: description || null,
        due_date: due_date || null,
        grade: grade || null,
        course_id: course_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating homework:", error);
      return NextResponse.json(
        { error: "Failed to create homework" },
        { status: 500 }
      );
    }

    return NextResponse.json({ homework });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Homework ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("homework")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting homework:", error);
      return NextResponse.json(
        { error: "Failed to delete homework" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
