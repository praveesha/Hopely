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
      });
      onClose();
    } catch (error) {
      console.error("Error submitting shortage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
