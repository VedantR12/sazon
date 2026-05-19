"use client";

import { useTransition } from "react";

import {
  approveSubmission,
  rejectSubmission,
} from "./actions";

export function SubmissionActions({
  submissionId,
}: {
  submissionId: string;
}) {

  const [isPending, startTransition] =
    useTransition();

  const handleApprove = () => {

    startTransition(async () => {

      try {

        await approveSubmission(submissionId);

      } catch (error) {

        console.error(error);
        alert("Failed to approve submission");
      }
    });
  };

  const handleReject = () => {

    startTransition(async () => {

      try {

        await rejectSubmission(submissionId);

      } catch (error) {

        console.error(error);
        alert("Failed to reject submission");
      }
    });
  };

  return (

    <div className="flex items-center gap-3 mt-6">

      <button
        onClick={handleApprove}
        disabled={isPending}
        className="
          bg-green-600
          hover:bg-green-700
          transition-colors
          text-white
          px-5
          py-2.5
          rounded-xl
          font-medium
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        {isPending
          ? "Processing..."
          : "Approve"}

      </button>

      <button
        onClick={handleReject}
        disabled={isPending}
        className="
          bg-red-600
          hover:bg-red-700
          transition-colors
          text-white
          px-5
          py-2.5
          rounded-xl
          font-medium
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        {isPending
          ? "Processing..."
          : "Reject"}

      </button>

    </div>
  );
}