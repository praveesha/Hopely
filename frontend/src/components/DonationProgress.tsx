import React from "react";
import {
  calculateDonationProgress,
  formatCurrency,
  getProgressBarColor,
} from "@/lib/donationUtils";

interface DonationProgressProps {
  totalDonated: number;
  estimatedFunding: number;
  currency?: string;
  className?: string;
  showPercentage?: boolean;
  showAmounts?: boolean;
}

export default function DonationProgress({
  totalDonated,
  estimatedFunding,
  currency = "LKR",
  className = "",
  showPercentage = true,
  showAmounts = true,
}: DonationProgressProps) {
  const progressPercentage = calculateDonationProgress(
    totalDonated,
    estimatedFunding
  );
  const progressBarColor = getProgressBarColor(progressPercentage);
  const remaining = Math.max(0, estimatedFunding - totalDonated);

  return (
    <div className={`donation-progress ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>

        {showPercentage && (
          <div className="absolute -top-1 right-0 text-xs font-semibold text-gray-700">
            {progressPercentage.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Amount Information */}
      {showAmounts && (
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            <span className="font-medium text-green-600">
              {formatCurrency(totalDonated, currency)}
            </span>
            <span className="text-gray-500"> raised</span>
          </div>

          <div className="text-gray-600">
            <span className="text-gray-500">Goal: </span>
            <span className="font-medium">
              {formatCurrency(estimatedFunding, currency)}
            </span>
          </div>
        </div>
      )}

      {/* Remaining Amount */}
      {showAmounts && remaining > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {formatCurrency(remaining, currency)} remaining
        </div>
      )}

      {/* Completion Status */}
      {progressPercentage >= 100 && (
        <div className="mt-2 text-xs font-medium text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Funding Goal Achieved!
        </div>
      )}
    </div>
  );
}

// Mini version for cards
export function MiniDonationProgress({
  totalDonated,
  estimatedFunding,
  className = "",
}: Pick<
  DonationProgressProps,
  "totalDonated" | "estimatedFunding" | "className"
>) {
  const progressPercentage = calculateDonationProgress(
    totalDonated,
    estimatedFunding
  );
  const progressBarColor = getProgressBarColor(progressPercentage);

  return (
    <div className={`mini-donation-progress ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Progress</span>
        <span className="text-xs font-medium text-gray-700">
          {progressPercentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${progressBarColor}`}
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
