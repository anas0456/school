import { NextResponse } from "next/server";

interface AdmissionFormData {
  studentName: string;
  birthDate: string;
  grade: string;
  parentMobile: string;
  email: string;
}

// EmailJS configuration
const SERVICE_ID = "service_l6t93xk";
const TEMPLATE_ID = "template_3a7ciir";
const PUBLIC_KEY = "t9bHNAu5OBlYLsZo0";

export async function POST(request: Request) {
  try {
    const data: AdmissionFormData = await request.json();

    // Validate required fields
    if (!data.studentName || !data.birthDate || !data.grade || !data.parentMobile || !data.email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Return the configuration to the client
    // The client will send the email directly using EmailJS
    return NextResponse.json({
      success: true,
      config: {
        serviceId: SERVICE_ID,
        templateId: TEMPLATE_ID,
        publicKey: PUBLIC_KEY,
        templateParams: {
          student_name: data.studentName,
          birth_date: data.birthDate,
          grade: data.grade,
          parent_mobile: data.parentMobile,
          student_email: data.email,
          to_email: "anasb3e@gmail.com",
        }
      }
    });
  } catch (error) {
    console.error("Error processing admission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
