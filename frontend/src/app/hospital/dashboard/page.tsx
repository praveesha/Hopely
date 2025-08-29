"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  User,
  Settings,
  Plus,
  Edit3,
  Save,
  X,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  PlusCircle,
  Trash2,
} from "lucide-react";
import {
  MedicineShortage,
  CreateShortageRequest,
  UrgencyLevel,
} from "@/models/MedicineRequest";
import {
  createShortage,
  getShortagesByHospital,
  cancelShortage,
  ApiResponse,
} from "@/lib/shortageApi";

// Types based on your backend
interface HospitalDetails {
  hospitalName: string;
  hospitalId: string;
  email: string;
  location: string;
  hospitalPhone: string;
  contactPersonName: string;
  contactPersonTitle: string;
  additionalNotes?: string;
}

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "shortages"
  >("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingShortage, setIsAddingShortage] = useState(false);

  // Hospital profile data
  const [hospitalDetails, setHospitalDetails] = useState<HospitalDetails>({
    hospitalName: "Colombo General Hospital",
    hospitalId: "CGH_001",
    email: "admin@cgh.health.gov.lk",
    location: "Colombo 08, Western Province",
    hospitalPhone: "+94-11-2691111",
    contactPersonName: "Dr. Nimal Perera",
    contactPersonTitle: "Chief Administrator",
    additionalNotes: "Leading tertiary care hospital in Sri Lanka",
  });

  // Medicine shortages data - will be loaded from API
  const [shortages, setShortages] = useState<MedicineShortage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newShortage, setNewShortage] = useState<CreateShortageRequest>({
    medicineName: "",
    genericName: "",
    urgencyLevel: UrgencyLevel.MEDIUM,
    quantityNeeded: 0,
    unit: "",
    description: "",
    expirationDate: "",
  });

  const getUrgencyColor = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.CRITICAL:
        return "bg-red-100 text-red-800 border-red-200";
      case UrgencyLevel.HIGH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case UrgencyLevel.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case UrgencyLevel.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Load shortages on component mount
  useEffect(() => {
    loadShortages();
  }, []);

  const loadShortages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(
        "🔄 Loading shortages for hospital:",
        hospitalDetails.hospitalId
      );
      const response = await getShortagesByHospital(hospitalDetails.hospitalId);
      console.log("📡 API response:", response);
      if (response.success && response.data) {
        console.log("✅ Shortages loaded:", response.data);
        setShortages(response.data);
      } else {
        console.log("❌ API response error:", response.message);
        setError(response.message || "Failed to load shortages");
      }
    } catch (err) {
      console.error("❌ Error loading shortages:", err);
      setError("Failed to load shortages");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    // Here you would make an API call to your backend for hospital profile
    console.log("Saving hospital profile:", hospitalDetails);
    setIsEditingProfile(false);
    // TODO: Add actual API call for hospital profile
  };

  const handleAddShortage = async () => {
    try {
      setError(null);
      const response = await createShortage(newShortage);
      if (response.success) {
        // Reload shortages to get the latest data
        await loadShortages();
        // Reset form
        setNewShortage({
          medicineName: "",
          genericName: "",
          urgencyLevel: UrgencyLevel.MEDIUM,
          quantityNeeded: 0,
          unit: "",
          description: "",
          expirationDate: "",
        });
        setIsAddingShortage(false);
      } else {
        setError(response.message || "Failed to create shortage");
      }
    } catch (err) {
      setError("Failed to create shortage");
      console.error("Error creating shortage:", err);
    }
  };

  const handleDeleteShortage = async (id: string) => {
    try {
      setError(null);
      const response = await cancelShortage(hospitalDetails.hospitalId, id);
      if (response.success) {
        // Reload shortages to get the latest data
        await loadShortages();
      } else {
        setError(response.message || "Failed to cancel shortage");
      }
    } catch (err) {
      setError("Failed to cancel shortage");
      console.error("Error cancelling shortage:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Hopely Hospital Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {hospitalDetails.contactPersonName}
              </span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex space-x-8 mb-8">
          {[
            { id: "overview", label: "Overview", icon: Building2 },
            { id: "profile", label: "Hospital Profile", icon: Settings },
            { id: "shortages", label: "Medicine Shortages", icon: AlertCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active Shortages</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : shortages.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Critical Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading
                        ? "..."
                        : shortages.filter(
                            (s) => s.urgencyLevel === UrgencyLevel.CRITICAL
                          ).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Hospital Status</p>
                    <p className="text-lg font-semibold text-green-700">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Shortages */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Medicine Shortages
                </h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading shortages...</div>
                  </div>
                ) : shortages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">No active shortages</div>
                  </div>
                ) : (
                  shortages.slice(0, 3).map((shortage) => (
                    <div
                      key={shortage.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {shortage.medicineName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Need: {shortage.quantityNeeded} {shortage.unit}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getUrgencyColor(
                          shortage.urgencyLevel
                        )}`}
                      >
                        {shortage.urgencyLevel}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Hospital Profile
              </h2>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Details</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hospital Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="h-4 w-4 inline mr-1" />
                    Hospital Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={hospitalDetails.hospitalName}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          hospitalName: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {hospitalDetails.hospitalName}
                    </p>
                  )}
                </div>

                {/* Hospital ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Hospital ID
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-600">
                    {hospitalDetails.hospitalId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hospital ID cannot be changed
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={hospitalDetails.email}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {hospitalDetails.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Hospital Phone
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={hospitalDetails.hospitalPhone}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          hospitalPhone: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {hospitalDetails.hospitalPhone}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={hospitalDetails.location}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          location: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {hospitalDetails.location}
                    </p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Contact Person Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={hospitalDetails.contactPersonName}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          contactPersonName: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {hospitalDetails.contactPersonName}
                    </p>
                  )}
                </div>

                {/* Contact Person Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Title
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={hospitalDetails.contactPersonTitle}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          contactPersonTitle: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {hospitalDetails.contactPersonTitle}
                    </p>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  {isEditingProfile ? (
                    <textarea
                      value={hospitalDetails.additionalNotes || ""}
                      onChange={(e) =>
                        setHospitalDetails({
                          ...hospitalDetails,
                          additionalNotes: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any additional information about your hospital..."
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg min-h-[80px]">
                      {hospitalDetails.additionalNotes || "No additional notes"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medicine Shortages Tab */}
        {activeTab === "shortages" && (
          <div className="space-y-6">
            {/* Add New Shortage Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Medicine Shortages
              </h2>
              <button
                onClick={() => setIsAddingShortage(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Post New Shortage</span>
              </button>
            </div>

            {/* Add New Shortage Form */}
            {isAddingShortage && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Post New Medicine Shortage
                  </h3>
                  <button
                    onClick={() => setIsAddingShortage(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={newShortage.medicineName}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          medicineName: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Paracetamol 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Generic Name
                    </label>
                    <input
                      type="text"
                      value={newShortage.genericName}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          genericName: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Acetaminophen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level *
                    </label>
                    <select
                      value={newShortage.urgencyLevel}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          urgencyLevel: e.target.value as UrgencyLevel,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value={UrgencyLevel.LOW}>Low</option>
                      <option value={UrgencyLevel.MEDIUM}>Medium</option>
                      <option value={UrgencyLevel.HIGH}>High</option>
                      <option value={UrgencyLevel.CRITICAL}>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Needed *
                    </label>
                    <input
                      type="number"
                      value={newShortage.quantityNeeded}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          quantityNeeded: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <input
                      type="text"
                      value={newShortage.unit}
                      onChange={(e) =>
                        setNewShortage({ ...newShortage, unit: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., tablets, vials, bottles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Expiration Date
                    </label>
                    <input
                      type="date"
                      value={newShortage.expirationDate}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          expirationDate: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newShortage.description}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Provide additional details about the shortage..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingShortage(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddShortage}
                    disabled={
                      !newShortage.medicineName ||
                      !newShortage.unit ||
                      newShortage.quantityNeeded <= 0
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Post Shortage
                  </button>
                </div>
              </div>
            )}

            {/* Shortages List */}
            {loading ? (
              <div className="flex items-center justify-center py-12 bg-white rounded-lg border">
                <div className="text-gray-500">Loading shortages...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {shortages.map((shortage) => (
                  <div
                    key={shortage.id}
                    className="bg-white p-6 rounded-lg shadow-sm border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {shortage.medicineName}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded border ${getUrgencyColor(
                              shortage.urgencyLevel
                            )}`}
                          >
                            {shortage.urgencyLevel}
                          </span>
                        </div>
                        {shortage.genericName && (
                          <p className="text-sm text-gray-600 mb-2">
                            Generic: {shortage.genericName}
                          </p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-500">
                              Quantity Needed
                            </p>
                            <p className="font-medium">
                              {shortage.quantityNeeded} {shortage.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date Posted</p>
                            <p className="font-medium">
                              {new Date(
                                shortage.datePosted
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {shortage.expirationDate && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Preferred Expiry
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  shortage.expirationDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">{shortage.status}</p>
                          </div>
                        </div>
                        {shortage.description && (
                          <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">
                            {shortage.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteShortage(shortage.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel shortage"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && shortages.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Medicine Shortages Posted
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by posting your first medicine shortage to connect with
                  donors.
                </p>
                <button
                  onClick={() => setIsAddingShortage(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post First Shortage</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
