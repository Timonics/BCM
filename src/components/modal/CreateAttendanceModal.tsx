import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  X,
  ClipboardCheck,
  Calendar,
  FileText,
  Users,
  Music,
  Grid3x3,
  GraduationCap,
  Sparkles,
  CheckCircle,
  AlertCircle,
  MapPin,
  Monitor,
} from "lucide-react";

interface CreateAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AttendanceType =
  | "General Service"
  | "Band Meeting"
  | "Unit Meeting"
  | "Class Session"
  | "Special Program";
type AttendanceMode = "Physical" | "Online" | "Hybrid";

export function CreateAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAttendanceModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "" as AttendanceType | "",
    description: "",
    date: "",
    mode: "Physical" as AttendanceMode,
    band: "",
    unit: "",
    classBatch: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data for dropdowns
  const bands = [
    { id: "b1", name: "Choir Band" },
    { id: "b2", name: "Youth Band" },
    { id: "b3", name: "Men Band" },
    { id: "b4", name: "Women Band" },
    { id: "b5", name: "Children Band" },
  ];

  const units = [
    { id: "u1", name: "Worship Unit" },
    { id: "u2", name: "Media Unit" },
    { id: "u3", name: "Ushering Unit" },
    { id: "u4", name: "Protocol Unit" },
    { id: "u5", name: "Hospitality Unit" },
  ];

  const classBatches = [
    { id: "c1", name: "Pre-Youth Class 2026" },
    { id: "c2", name: "BAPTJAN2026" },
    { id: "c3", name: "BAPTAUG2026" },
    { id: "c4", name: "ETSJAN2026" },
    { id: "c5", name: "ETSAUG2026" },
  ];

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Attendance title is required";
    }

    if (!formData.type) {
      newErrors.type = "Attendance type is required";
    }

    if (!formData.date) {
      newErrors.date = "Attendance date is required";
    }

    // Conditional validation based on type
    if (formData.type === "Band Meeting" && !formData.band) {
      newErrors.band = "Please select a band";
    }

    if (formData.type === "Unit Meeting" && !formData.unit) {
      newErrors.unit = "Please select a unit";
    }

    if (formData.type === "Class Session" && !formData.classBatch) {
      newErrors.classBatch = "Please select a class batch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Creating attendance:", formData);

      // Show success message
      setShowSuccess(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onClose();
        onSuccess?.();
      }, 2000);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      date: "",
      mode: "Physical",
      band: "",
      unit: "",
      classBatch: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!showSuccess) {
      resetForm();
      onClose();
    }
  };

  const getTypeIcon = (type: AttendanceType | "") => {
    switch (type) {
      case "General Service":
        return <Users className="w-4 h-4" />;
      case "Band Meeting":
        return <Music className="w-4 h-4" />;
      case "Unit Meeting":
        return <Grid3x3 className="w-4 h-4" />;
      case "Class Session":
        return <GraduationCap className="w-4 h-4" />;
      case "Special Program":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  const shouldShowBandField = formData.type === "Band Meeting";
  const shouldShowUnitField = formData.type === "Unit Meeting";
  const shouldShowClassField = formData.type === "Class Session";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Success State */}
          {showSuccess ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-[#222B45] mb-2">
                Attendance Created!
              </h3>
              <p className="text-[#8F9BB3]">
                Your attendance record has been created successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#222B45]">
                      Create Attendance
                    </h2>
                    <p className="text-sm text-[#8F9BB3]">
                      Record attendance for a service or event
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#F7F9FC] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#8F9BB3]" />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleSubmit}
                className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]"
              >
                <div className="space-y-5">
                  {/* Attendance Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Attendance Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="e.g., Sunday Morning Service"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] ${
                          errors.title ? "border-red-500" : "border-[#EDF1F7]"
                        }`}
                      />
                    </div>
                    {errors.title && (
                      <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Attendance Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Attendance Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F9BB3]">
                        {getTypeIcon(formData.type)}
                      </div>
                      <select
                        value={formData.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white ${
                          errors.type ? "border-red-500" : "border-[#EDF1F7]"
                        }`}
                      >
                        <option value="">Select attendance type...</option>
                        <option value="General Service">General Service</option>
                        <option value="Band Meeting">Band Meeting</option>
                        <option value="Unit Meeting">Unit Meeting</option>
                        <option value="Class Session">Class Session</option>
                        <option value="Special Program">Special Program</option>
                      </select>
                    </div>
                    {errors.type && (
                      <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.type}</span>
                      </div>
                    )}
                  </div>

                  {/* Conditional Fields */}
                  {shouldShowBandField && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-[#222B45] mb-2">
                        Select Band <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                        <select
                          value={formData.band}
                          onChange={(e) => handleChange("band", e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white ${
                            errors.band ? "border-red-500" : "border-[#EDF1F7]"
                          }`}
                        >
                          <option value="">Select a band...</option>
                          {bands.map((band) => (
                            <option key={band.id} value={band.id}>
                              {band.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.band && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.band}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {shouldShowUnitField && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-[#222B45] mb-2">
                        Select Unit <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Grid3x3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                        <select
                          value={formData.unit}
                          onChange={(e) => handleChange("unit", e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white ${
                            errors.unit ? "border-red-500" : "border-[#EDF1F7]"
                          }`}
                        >
                          <option value="">Select a unit...</option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.unit && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.unit}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {shouldShowClassField && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-[#222B45] mb-2">
                        Select Class Batch{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                        <select
                          value={formData.classBatch}
                          onChange={(e) =>
                            handleChange("classBatch", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white ${
                            errors.classBatch
                              ? "border-red-500"
                              : "border-[#EDF1F7]"
                          }`}
                        >
                          <option value="">Select a class batch...</option>
                          {classBatches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {batch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.classBatch && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.classBatch}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Add any additional notes or details..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] resize-none"
                    />
                  </div>

                  {/* Date and Mode Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Attendance Date */}
                    <div>
                      <label className="block text-sm font-medium text-[#222B45] mb-2">
                        Attendance Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleChange("date", e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] ${
                            errors.date ? "border-red-500" : "border-[#EDF1F7]"
                          }`}
                        />
                      </div>
                      {errors.date && (
                        <div className="flex items-center gap-1 mt-1.5 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Attendance Mode */}
                    <div>
                      <label className="block text-sm font-medium text-[#222B45] mb-2">
                        Attendance Mode <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                        <select
                          value={formData.mode}
                          onChange={(e) =>
                            handleChange(
                              "mode",
                              e.target.value as AttendanceMode
                            )
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white"
                        >
                          <option value="Physical">Physical</option>
                          <option value="Online">Online</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Mode Info Badge */}
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Monitor className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-blue-900">
                      <p className="font-medium mb-1">Attendance Mode:</p>
                      <ul className="space-y-0.5 text-blue-700">
                        <li>
                          • <strong>Physical:</strong> In-person attendance only
                        </li>
                        <li>
                          • <strong>Online:</strong> Virtual attendance only
                        </li>
                        <li>
                          • <strong>Hybrid:</strong> Both in-person and virtual
                          attendance
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[#EDF1F7] bg-[#F7F9FC]">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="border-[#EDF1F7]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Create Attendance
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
