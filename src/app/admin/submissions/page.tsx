import { createClient } from "@/lib/supabase/server";

import { SubmissionActions } from "./submission-actions";

export default async function SubmissionsPage() {

    const supabase = await createClient();

    const { data: submissions, error } = await supabase
        .from("vendor_submissions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (error) {

        return (
            <div className="p-8">
                Failed to load submissions
            </div>
        );
    }

    return (

        <div className="w-full p-4 md:p-6 lg:p-8">

            <div className="mb-8">

                <h1 className="text-3xl lg:text-4xl font-bold text-black">
                    Pending Submissions
                </h1>

                <p className="text-gray-500 mt-2">
                    Review and moderate vendor requests
                </p>

            </div>

            <div className="space-y-6 overflow-x-auto pb-4">

                {submissions?.map((submission) => (

                    <div
                        key={submission.id}
                        className="
    w-full
    min-w-0
    bg-white
    border
    rounded-3xl
    overflow-hidden
    shadow-sm
  "
                    >

                        <div className="
  flex
  flex-col
  xl:flex-row
  min-w-0
">

                            {submission.image_url && (

                                <div className="
  w-full
  xl:w-[260px]
  h-[220px]
  sm:h-[260px]
  xl:h-auto
  shrink-0
">

                                    <img
                                        src={submission.image_url}
                                        alt={submission.name}
                                        className="
                      w-full
                      h-full
                      object-cover
                    "
                                    />

                                </div>
                            )}

                            <div className="
  flex-1
  p-5
  lg:p-8
  min-w-0
">

                                <div className="
  flex
  flex-col
  gap-4
">

                                    <div className="min-w-0 overflow-hidden">

                                        <h2 className="
  text-2xl
  lg:text-3xl
  font-bold
  text-black
  break-words
  overflow-hidden
">
                                            {submission.name}
                                        </h2>

                                        <p className="
                      text-gray-500
                      mt-2
                      break-words
                    ">
                                            {submission.address || "No address"}
                                        </p>

                                    </div>

                                    <div className="
                    bg-yellow-100
                    text-yellow-800
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    self-start
                    shrink-0
                  ">
                                        Pending
                                    </div>

                                </div>

                                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-5
                  mt-8
                ">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Best Item
                                        </p>

                                        <p className="
                      text-black
                      font-semibold
                      mt-1
                      break-words
                    ">
                                            {submission.best_item || "N/A"}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Phone
                                        </p>

                                        <p className="
                      text-black
                      font-semibold
                      mt-1
                    ">
                                            {submission.phone || "N/A"}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Latitude
                                        </p>

                                        <p className="
                      text-black
                      font-medium
                      mt-1
                    ">
                                            {submission.latitude}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Longitude
                                        </p>

                                        <p className="
                      text-black
                      font-medium
                      mt-1
                    ">
                                            {submission.longitude}
                                        </p>

                                    </div>

                                </div>

                                <div className="
  mt-8
  flex
  flex-col
  gap-6
">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Submitted On
                                        </p>

                                        <p className="
                      text-black
                      font-medium
                      mt-1
                    ">
                                            {new Date(
                                                submission.created_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <SubmissionActions
                                        submissionId={submission.id}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}