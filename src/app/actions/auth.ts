"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/lib/apiClient";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetchApi("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const token = response.key || response.token || response.access;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      // Return is_staff so the client can set the right localStorage flags
      return { success: true, isStaff: response.is_staff === true };
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  } catch (error: any) {
    return { success: false, error: error.message || "An error occurred during login." };
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  try {
    const response = await fetchApi("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        email,
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    const token = response.key || response.token || response.access;
    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    // Return is_staff so the client can set the right localStorage flags
    return { success: true, isStaff: response.is_staff === true };
  } catch (error: any) {
    return { success: false, error: error.message || "An error occurred during registration." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}
