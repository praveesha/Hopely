"use client";

import React, { useState } from "react";
import Card from "../Card";
import LoadingSpinner from "../LoadingSpinner";

// Icons as simple SVG components
const XIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

interface MedicineShortage {
  id: string;
  medicineName: string;
  genericName?: string;
  urgencyLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  quantityNeeded: number;
  unit: string;
  description?: string;
  datePosted: string;
  expirationDate?: string;

  // Funding Information
  estimatedFunding?: number;
  costPerUnit?: number;
  fundingNote?: string;
}

interface MedicineShortageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (shortage: Omit<MedicineShortage, "id" | "datePosted">) => void;
  initialData?: Partial<Omit<MedicineShortage, "id" | "datePosted">>;
}

export default function MedicineShortageForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: MedicineShortageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    medicineName: initialData?.medicineName || "",
    genericName: initialData?.genericName || "",
    urgencyLevel: initialData?.urgencyLevel || ("MEDIUM" as const),
    quantityNeeded: initialData?.quantityNeeded || 0,
    unit: initialData?.unit || "",
    description: initialData?.description || "",
    expirationDate: initialData?.expirationDate || "",

    // Funding Information
    estimatedFunding: initialData?.estimatedFunding || 0,
    costPerUnit: initialData?.costPerUnit || 0,
    fundingNote: initialData?.fundingNote || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.medicineName.trim()) {
      newErrors.medicineName = "Medicine name is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (formData.quantityNeeded <= 0) {
      newErrors.quantityNeeded = "Quantity must be greater than 0";
    }

    // Funding validation
    if (formData.estimatedFunding < 0) {
      newErrors.estimatedFunding = "Estimated funding cannot be negative";
    }

    if (formData.costPerUnit < 0) {
      newErrors.costPerUnit = "Cost per unit cannot be negative";
    }

    // Auto-calculate estimated funding if costPerUnit is provided
    if (formData.costPerUnit > 0 && formData.quantityNeeded > 0) {
      const calculatedTotal = formData.costPerUnit * formData.quantityNeeded;
      if (
        formData.estimatedFunding > 0 &&
        Math.abs(formData.estimatedFunding - calculatedTotal) > 1
      ) {
        newErrors.estimatedFunding = `Based on cost per unit (${
          formData.costPerUnit
        } × ${
          formData.quantityNeeded
        }), estimated funding should be around LKR ${calculatedTotal.toLocaleString()}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        medicineName: "",
        genericName: "",
        urgencyLevel: "MEDIUM",
        quantityNeeded: 0,
        unit: "",
        description: "",
        expirationDate: "",
        estimatedFunding: 0,
        costPerUnit: 0,
        fundingNote: "",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting shortage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-calculate estimated funding when cost per unit or quantity changes
      if (field === "costPerUnit" || field === "quantityNeeded") {
        const costPerUnit =
          field === "costPerUnit" ? Number(value) : prev.costPerUnit;
        const quantityNeeded =
          field === "quantityNeeded" ? Number(value) : prev.quantityNeeded;

        if (costPerUnit > 0 && quantityNeeded > 0) {
          newData.estimatedFunding = costPerUnit * quantityNeeded;
        }
      }

      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card
          title="Post New Medicine Shortage"
          headerActions={
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <XIcon />
            </button>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={formData.medicineName}
                  onChange={(e) => handleChange("medicineName", e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.medicineName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Paracetamol 500mg"
                />
                {errors.medicineName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.medicineName}
                  </p>
                )}
              </div>

              {/* Generic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generic Name
                </label>
                <input
                  type="text"
                  value={formData.genericName}
                  onChange={(e) => handleChange("genericName", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Acetaminophen"
                />
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>
                <select
                  value={formData.urgencyLevel}
                  onChange={(e) => handleChange("urgencyLevel", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Needed *
                </label>
                <input
                  type="number"
                  value={formData.quantityNeeded}
                  onChange={(e) =>
                    handleChange(
                      "quantityNeeded",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.quantityNeeded ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0"
                  min="1"
                />
                {errors.quantityNeeded && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.quantityNeeded}
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.unit ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., tablets, vials, bottles"
                />
                {errors.unit && (
                  <p className="text-red-600 text-sm mt-1">{errors.unit}</p>
                )}
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) =>
                    handleChange("expirationDate", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Funding Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                Funding Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cost Per Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Per Unit (LKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPerUnit}
                    onChange={(e) =>
                      handleChange(
                        "costPerUnit",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.costPerUnit ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.costPerUnit && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.costPerUnit}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Cost per {formData.unit || "unit"}
                  </p>
                </div>

                {/* Estimated Total Funding */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Total Funding (LKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.estimatedFunding}
                    onChange={(e) =>
                      handleChange(
                        "estimatedFunding",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.estimatedFunding
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.estimatedFunding && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.estimatedFunding}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Total amount needed to fulfill this shortage
                  </p>
                </div>
              </div>

              {/* Funding Note */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Calculation Note
                </label>
                <input
                  type="text"
                  value={formData.fundingNote}
                  onChange={(e) => handleChange("fundingNote", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Based on current supplier quotes, includes 10% buffer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Explain how the funding amount was calculated
                </p>
              </div>

              {/* Auto-calculation display */}
              {formData.costPerUnit > 0 && formData.quantityNeeded > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Auto-calculation:</span>{" "}
                    {formData.costPerUnit.toLocaleString()} LKR ×{" "}
                    {formData.quantityNeeded} {formData.unit} ={" "}
                    {(
                      formData.costPerUnit * formData.quantityNeeded
                    ).toLocaleString()}{" "}
                    LKR
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Provide additional details about the shortage..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.medicineName ||
                  !formData.unit ||
                  formData.quantityNeeded <= 0
                }
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="gray" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    <span>Post Shortage</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
