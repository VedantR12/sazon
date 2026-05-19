import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {

  const supabase = await createClient();

  // PENDING SUBMISSIONS

  const {
    count: pendingSubmissions,
  } = await supabase
    .from("vendor_submissions")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "pending");

  // TOTAL VENDORS

  const {
    count: totalVendors,
  } = await supabase
    .from("vendors")
    .select("*", {
      count: "exact",
      head: true,
    });

  // APPROVED SUBMISSIONS

  const {
    count: approvedSubmissions,
  } = await supabase
    .from("vendor_submissions")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "approved");

  return (

    <div className="p-6 lg:p-8">

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-black">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor vendors and moderation activity
        </p>

      </div>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {/* PENDING */}

        <div className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-6
        ">

          <p className="
            text-sm
            font-medium
            text-gray-500
          ">
            Pending Submissions
          </p>

          <h2 className="
            text-5xl
            font-bold
            text-black
            mt-4
          ">
            {pendingSubmissions || 0}
          </h2>

        </div>

        {/* VENDORS */}

        <div className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-6
        ">

          <p className="
            text-sm
            font-medium
            text-gray-500
          ">
            Total Vendors
          </p>

          <h2 className="
            text-5xl
            font-bold
            text-black
            mt-4
          ">
            {totalVendors || 0}
          </h2>

        </div>

        {/* APPROVED */}

        <div className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-6
        ">

          <p className="
            text-sm
            font-medium
            text-gray-500
          ">
            Approved Submissions
          </p>

          <h2 className="
            text-5xl
            font-bold
            text-black
            mt-4
          ">
            {approvedSubmissions || 0}
          </h2>

        </div>

      </div>

    </div>
  );
}