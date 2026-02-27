import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Query the users table
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !users) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    return NextResponse.json({
      success: true,
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        fatherName: users.father_name,
        motherName: users.mother_name,
        age: users.age,
        gender: users.gender,
        phone: users.phone,
        subject: users.subject,
        qualification: users.qualification,
        experienceYears: users.experience_years,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
