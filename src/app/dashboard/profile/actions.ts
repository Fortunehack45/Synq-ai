
'use server';

import { revalidatePath } from "next/cache";

export type ProfileState = {
  success: boolean;
  message: string;
};

// This is a server action that will run on the server.
// For this demo, it doesn't actually save to a database, but it simulates a delay
// and returns a success or error message. The actual data is saved in localStorage
// on the client-side, which you'll see in the page.tsx file.
export async function saveProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const username = formData.get('username') as string;
  const bio = formData.get('bio') as string;

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!username) {
    return { success: false, message: "Username cannot be empty." };
  }

  // In a real app, you would save this to your database here.
  console.log("Saving profile:", { username, bio });
  
  revalidatePath('/dashboard/profile');

  return { success: true, message: "Profile saved successfully!" };
}
