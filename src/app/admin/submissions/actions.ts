"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function approveSubmission(
  submissionId: string
) {

  const supabase = await createClient();

  // GET SUBMISSION

  const {
    data: submission,
    error: submissionError,
  } = await supabase
    .from("vendor_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (submissionError || !submission) {
    throw new Error("Submission not found");
  }

  // STOP DOUBLE APPROVALS

  if (submission.status !== "pending") {
    throw new Error("Submission already processed");
  }

  // INSERT VENDOR

  const { error: vendorError } = await supabase
    .from("vendors")
    .insert({
      name: submission.name,
      address: submission.address,
      best_item: submission.best_item,
      latitude: submission.latitude,
      longitude: submission.longitude,
      image_url: submission.image_url,
      phone: submission.phone,
    });

  if (vendorError) {
    console.error(vendorError);
    throw new Error(vendorError.message);
  }

  // UPDATE STATUS

  const { error: updateError } = await supabase
    .from("vendor_submissions")
    .update({
      status: "approved",
    })
    .eq("id", submissionId);

  if (updateError) {
    console.error(updateError);
    throw new Error(updateError.message);
  }

  revalidatePath("/admin/submissions");
  revalidatePath("/");
}

export async function rejectSubmission(
  submissionId: string
) {

  const supabase = await createClient();

  const { error } = await supabase
    .from("vendor_submissions")
    .update({
      status: "rejected",
    })
    .eq("id", submissionId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/submissions");
}