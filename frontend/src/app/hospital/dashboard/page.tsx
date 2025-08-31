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
import DonationProgress from "@/components/DonationProgress";
import { DonationAPI } from "@/lib/donationApi";
import { formatCurrency } from "@/lib/donationUtils";
import Navigation from "@/components/Navigation";

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
  const [donationProgress, setDonationProgress] = useState<
    Record<string, { total_donated: number; donation_count: number }>
  >({});
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

    // Funding Information
    estimatedFunding: 0,
    costPerUnit: 0,
    fundingNote: "",
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

        // Load donation progress for each shortage
        const progressPromises = response.data.map(
          async (shortage: MedicineShortage) => {
            try {
              const donationData = await DonationAPI.getDonationsByShortage(
                shortage.id
              );
              return {
                shortageId: shortage.id,
                progress: donationData.success ? donationData.data : null,
              };
            } catch (err) {
              console.warn(
                `Failed to load donations for shortage ${shortage.id}:`,
                err
              );
              return { shortageId: shortage.id, progress: null };
            }
          }
        );

        const progressResults = await Promise.all(progressPromises);
        const progressMap: Record<
          string,
          { total_donated: number; donation_count: number }
        > = {};

        progressResults.forEach(({ shortageId, progress }) => {
          if (progress) {
            progressMap[shortageId] = {
              total_donated: progress.total_donated,
              donation_count: progress.donation_count,
            };
          }
        });

        setDonationProgress(progressMap);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#143f3f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-[#143f3f]/10 mb-8">
            <Building2 className="h-6 w-6 text-[#143f3f]" />
            <span className="text-lg font-semibold text-[#143f3f]">
              Hospital Dashboard
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#143f3f] via-emerald-600 to-[#143f3f] bg-clip-text text-transparent">
              Welcome back,
            </span>
            <br />
            <span className="text-[#143f3f] block text-4xl md:text-5xl lg:text-6xl mt-2">
              {hospitalDetails.contactPersonName}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Manage your hospital profile, post medicine shortages, and track
            donations from your community.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-4 mb-12 justify-center">
          {[
            { id: "overview", label: "Overview", icon: Building2 },
            { id: "profile", label: "Hospital Profile", icon: Settings },
            { id: "shortages", label: "Medicine Shortages", icon: AlertCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                activeTab === id
                  ? "bg-gradient-to-r from-[#143f3f] to-emerald-600 text-white shadow-xl"
                  : "bg-white/80 backdrop-blur-sm text-[#143f3f] hover:bg-white hover:shadow-xl border border-[#143f3f]/10"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#143f3f]/10 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Active Shortages
                    </p>
                    <p className="text-3xl font-bold text-[#143f3f]">
                      {loading ? "..." : shortages.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#143f3f]/10 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Critical Items
                    </p>
                    <p className="text-3xl font-bold text-[#143f3f]">
                      {loading
                        ? "..."
                        : shortages.filter(
                            (s) => s.urgencyLevel === UrgencyLevel.CRITICAL
                          ).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#143f3f]/10 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Hospital Status
                    </p>
                    <p className="text-3xl font-bold text-[#143f3f]">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#143f3f]/10 p-6">
              <h3 className="text-xl font-bold text-[#143f3f] mb-6">
                Recent Medicine Shortages
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500 text-lg">
                    Loading shortages...
                  </div>
                </div>
              ) : shortages.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-500 text-lg">
                      No active shortages
                    </div>
                    <p className="text-gray-400 mt-2">
                      Post your first medicine shortage to get started
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {shortages.slice(0, 3).map((shortage) => (
                    <div
                      key={shortage.id}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            shortage.urgencyLevel === UrgencyLevel.CRITICAL
                              ? "bg-red-500"
                              : shortage.urgencyLevel === UrgencyLevel.HIGH
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="font-semibold text-[#143f3f]">
                            {shortage.medicineName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Need: {shortage.quantityNeeded} {shortage.unit}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          shortage.urgencyLevel === UrgencyLevel.CRITICAL
                            ? "bg-red-100 text-red-700"
                            : shortage.urgencyLevel === UrgencyLevel.HIGH
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {shortage.urgencyLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any additional information about your hospital..."
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg min-h-[80px] text-gray-900 font-medium">
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      onChange={(e) => {
                        const quantityNeeded = parseInt(e.target.value) || 0;
                        const estimatedFunding =
                          (newShortage.costPerUnit || 0) > 0 &&
                          quantityNeeded > 0
                            ? (newShortage.costPerUnit || 0) * quantityNeeded
                            : newShortage.estimatedFunding || 0;
                        setNewShortage({
                          ...newShortage,
                          quantityNeeded,
                          estimatedFunding,
                        });
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Funding Information Section */}
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
                  </h4>

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
                        value={newShortage.costPerUnit || 0}
                        onChange={(e) => {
                          const costPerUnit = parseFloat(e.target.value) || 0;
                          const estimatedFunding =
                            costPerUnit > 0 && newShortage.quantityNeeded > 0
                              ? costPerUnit * newShortage.quantityNeeded
                              : newShortage.estimatedFunding || 0;
                          setNewShortage({
                            ...newShortage,
                            costPerUnit,
                            estimatedFunding,
                          });
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional: Cost per {newShortage.unit || "unit"}
                      </p>
                    </div>

                    {/* Estimated Total Funding */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Total Funding (LKR) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newShortage.estimatedFunding || 0}
                        onChange={(e) =>
                          setNewShortage({
                            ...newShortage,
                            estimatedFunding: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                        required
                      />
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
                      value={newShortage.fundingNote || ""}
                      onChange={(e) =>
                        setNewShortage({
                          ...newShortage,
                          fundingNote: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., Based on current supplier quotes, includes 10% buffer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Explain how the funding amount was calculated
                    </p>
                  </div>

                  {/* Auto-calculation display */}
                  {(newShortage.costPerUnit || 0) > 0 &&
                    newShortage.quantityNeeded > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Auto-calculation:</span>{" "}
                          {(newShortage.costPerUnit || 0).toLocaleString()} LKR
                          × {newShortage.quantityNeeded} {newShortage.unit} ={" "}
                          {(
                            (newShortage.costPerUnit || 0) *
                            newShortage.quantityNeeded
                          ).toLocaleString()}{" "}
                          LKR
                        </p>
                      </div>
                    )}
                </div>

                <div className="mt-6">
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
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Provide additional details about the shortage..."
                  />
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
                          {shortage.estimatedFunding && (
                            <div>
                              <p className="text-sm text-gray-500">
                                Estimated Funding
                              </p>
                              <p className="font-medium text-green-600">
                                {formatCurrency(shortage.estimatedFunding)}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Date Posted</p>
                            <p className="font-medium">
                              {new Date(
                                shortage.datePosted
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">{shortage.status}</p>
                          </div>
                        </div>

                        {/* Funding Progress Section */}
                        {shortage.estimatedFunding &&
                          shortage.estimatedFunding > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Donation Progress
                              </h4>
                              <DonationProgress
                                totalDonated={
                                  donationProgress[shortage.id]
                                    ?.total_donated || 0
                                }
                                estimatedFunding={shortage.estimatedFunding}
                                showPercentage={true}
                                showAmounts={true}
                                className="mb-2"
                              />
                              <div className="flex justify-between items-center text-xs text-gray-600">
                                <span>
                                  {donationProgress[shortage.id]
                                    ?.donation_count || 0}{" "}
                                  donation
                                  {(donationProgress[shortage.id]
                                    ?.donation_count || 0) !== 1
                                    ? "s"
                                    : ""}{" "}
                                  received
                                </span>
                                {shortage.costPerUnit && (
                                  <span>
                                    Cost per unit:{" "}
                                    {formatCurrency(shortage.costPerUnit)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        {shortage.description && (
                          <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded">
                            {shortage.description}
                          </p>
                        )}
                        {shortage.fundingNote && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            <strong>Funding Note:</strong>{" "}
                            {shortage.fundingNote}
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
