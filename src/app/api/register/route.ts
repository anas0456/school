import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, password, name, role, fatherName, motherName, age, gender, phone, subject, qualification, experienceYears } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Insert new user with additional info
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        password,
        name,
        role: role || "student",
        father_name: fatherName || null,
        mother_name: motherName || null,
        age: age || null,
        gender: gender || null,
        phone: phone || null,
        subject: subject || null,
        qualification: qualification || null,
        experience_years: experienceYears || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Register error:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        fatherName: newUser.father_name,
        motherName: newUser.mother_name,
        age: newUser.age,
        gender: newUser.gender,
        phone: newUser.phone,
        subject: newUser.subject,
        qualification: newUser.qualification,
        experienceYears: newUser.experience_years,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
