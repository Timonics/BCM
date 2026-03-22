"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Church,
  Briefcase,
  FileCheck,
  AlertCircle,
  Info,
  Loader2,
  X,
} from "lucide-react";
import { useCreateMember } from "@/hooks/useMembers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  // Bio Data
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  country: string;
  stateOfOrigin: string;
  residentialState: string;
  city: string;
  lga: string;
  address: string;

  // Church Information
  memberStatus: string[];
  presentBand: string;
  units: string[];
  baptismStatus: string;
  baptismLocation: string;
  baptismDate: string;
  membershipPath: string;

  // Academics and Work
  institution: string;
  course: string;
  qualification: string;
  startDate: string;
  endDate: string;
  placeOfWork: string;
  officeAddress: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function AddMemberForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [bandEligible, setBandEligible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  
  const { createMember, isCreating } = useCreateMember();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    surname: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    country: "",
    stateOfOrigin: "",
    residentialState: "",
    city: "",
    lga: "",
    address: "",
    memberStatus: [],
    presentBand: "",
    units: [],
    baptismStatus: "",
    baptismLocation: "",
    baptismDate: "",
    membershipPath: "",
    institution: "",
    course: "",
    qualification: "",
    startDate: "",
    endDate: "",
    placeOfWork: "",
    officeAddress: "",
  });

  const steps = [
    { number: 1, title: "Bio Data", icon: User },
    { number: 2, title: "Church Information", icon: Church },
    { number: 3, title: "Academics & Work", icon: Briefcase },
    { number: 4, title: "Review & Submit", icon: FileCheck },
  ];

  // Calculate age from date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge >= 0 ? calculatedAge : null);
      
      // Validate age
      if (calculatedAge < 0) {
        setValidationErrors(prev => ({ ...prev, dateOfBirth: "Invalid date of birth" }));
      } else if (calculatedAge > 120) {
        setValidationErrors(prev => ({ ...prev, dateOfBirth: "Age seems unrealistic" }));
      } else {
        setValidationErrors(prev => {
          const { dateOfBirth, ...rest } = prev;
          return rest;
        });
      }
    } else {
      setAge(null);
    }
  }, [formData.dateOfBirth]);

  // Check band eligibility
  useEffect(() => {
    const isEligible = age !== null && formData.baptismStatus !== "";
    setBandEligible(isEligible);

    if (!isEligible && formData.presentBand) {
      setFormData((prev) => ({ ...prev, presentBand: "" }));
    }
  }, [age, formData.baptismStatus]);

  // Validate step fields
  const validateStep = (step: number): boolean => {
    const errors: ValidationErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) errors.firstName = "First name is required";
      if (!formData.surname.trim()) errors.surname = "Surname is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) errors.phone = "Phone number is required";
      if (!formData.gender) errors.gender = "Gender is required";
      if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
      if (!formData.maritalStatus) errors.maritalStatus = "Marital status is required";
      if (!formData.country) errors.country = "Country is required";
      if (!formData.stateOfOrigin) errors.stateOfOrigin = "State of origin is required";
    }
    
    if (step === 2) {
      if (formData.memberStatus.length === 0) {
        errors.memberStatus = "At least one member status is required";
      }
      if (!formData.baptismStatus) errors.baptismStatus = "Baptism status is required";
      if (bandEligible && !formData.presentBand) {
        errors.presentBand = "Band selection is required";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => new Set(prev).add(field));
  };

  const handleMultiSelectChange = (field: keyof FormData, value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFormData((prev) => ({ ...prev, [field]: newValues }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      const element = document.getElementById(`field-${firstError}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      // Transform form data to match API expectations
      const submitData = {
        memberCode: `BCM${Date.now()}`, // Generate temporary code, backend might override
        firstName: formData.firstName,
        middleName: formData.middleName,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        stateOfOrigin: formData.stateOfOrigin,
        country: formData.country,
        residentialState: formData.residentialState,
        city: formData.city,
        lga: formData.lga,
        addressLine: formData.address,
        membershipPath: formData.membershipPath,
        baptismStatus: formData.baptismStatus,
        bandId: formData.presentBand || undefined,
        unitIds: formData.units,
        enrollPreYouth: formData.memberStatus.includes("Pre Youth"),
        enrollBaptismal: formData.memberStatus.includes("Baptized"),
        enrollETS: formData.memberStatus.includes("ETS"),
        classBatchIds: [], // You can add class batch selection if needed
        academics: formData.institution || formData.course ? [{
          institution: formData.institution,
          courseProgram: formData.course,
          qualification: formData.qualification,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }] : [],
        placeOfWork: formData.placeOfWork,
        officeAddress: formData.officeAddress,
      };

      await createMember(submitData);
      
      // Success is handled in the hook, but we can navigate after a delay
      setTimeout(() => {
        router.push("/dashboard/members");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error is already handled by the hook with toast
    }
  };

  const getFieldError = (field: string) => {
    return touched.has(field) && validationErrors[field] ? validationErrors[field] : null;
  };

  const ErrorMessage = ({ error }: { error?: string | null }) => {
    if (!error) return null;
    return <p className="text-xs text-red-500 mt-1">{error}</p>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#222B45]">
          Add New Member
        </h2>
        <p className="text-sm text-[#8F9BB3] mt-1">
          Complete all steps to add a new member to the system
        </p>
      </div>

      {/* Stepper - Mobile Responsive */}
      <Card className="border-[#EDF1F7] shadow-sm overflow-x-auto">
        <CardContent className="p-4 sm:p-6 min-w-125 sm:min-w-0">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                            ? "bg-[#009AF4] text-white"
                            : "bg-[#EDF1F7] text-[#8F9BB3]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          isActive
                            ? "text-[#009AF4]"
                            : isCompleted
                              ? "text-green-600"
                              : "text-[#8F9BB3]"
                        }`}
                      >
                        <span className="hidden sm:inline">{step.title}</span>
                        <span className="sm:hidden">Step {step.number}</span>
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 px-2 sm:px-4 pb-8">
                      <div
                        className={`h-0.5 ${
                          currentStep > step.number
                            ? "bg-green-500"
                            : "bg-[#EDF1F7]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {/* Loading Overlay */}
          {isCreating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#009AF4] mx-auto mb-4" />
                <p className="text-[#222B45] font-medium">Creating member...</p>
                <p className="text-sm text-[#8F9BB3] mt-1">Please wait</p>
              </div>
            </div>
          )}

          {/* Step 1: Bio Data */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">
                  Personal Information
                </h3>
                <p className="text-sm text-[#8F9BB3]">
                  Enter the member's basic personal details
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div id="field-firstName">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    onBlur={() => handleBlur("firstName")}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    placeholder="Enter first name"
                  />
                  <ErrorMessage error={getFieldError("firstName")} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Middle / Baptism Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    placeholder="Enter middle name"
                  />
                </div>

                <div id="field-surname">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) =>
                      handleInputChange("surname", e.target.value)
                    }
                    onBlur={() => handleBlur("surname")}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    placeholder="Enter surname"
                  />
                  <ErrorMessage error={getFieldError("surname")} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div id="field-email">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    placeholder="example@email.com"
                  />
                  <ErrorMessage error={getFieldError("email")} />
                </div>

                <div id="field-phone">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    placeholder="+234 XXX XXX XXXX"
                  />
                  <ErrorMessage error={getFieldError("phone")} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div id="field-gender">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    onBlur={() => handleBlur("gender")}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ErrorMessage error={getFieldError("gender")} />
                </div>

                <div id="field-dateOfBirth">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    onBlur={() => handleBlur("dateOfBirth")}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                  />
                  <ErrorMessage error={getFieldError("dateOfBirth")} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Age
                  </label>
                  <div className="px-4 py-2.5 border border-[#EDF1F7] rounded-lg bg-[#F7F9FC] text-[#222B45] font-medium">
                    {age !== null ? `${age} years` : "Auto-calculated"}
                  </div>
                </div>
              </div>

              <div id="field-maritalStatus">
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) =>
                    handleInputChange("maritalStatus", e.target.value)
                  }
                  onBlur={() => handleBlur("maritalStatus")}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                >
                  <option value="">Select marital status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
                <ErrorMessage error={getFieldError("maritalStatus")} />
              </div>

              <div className="pt-4 border-t border-[#EDF1F7]">
                <h4 className="font-medium text-[#222B45] mb-4">
                  Location Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div id="field-country">
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      onBlur={() => handleBlur("country")}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter country"
                    />
                    <ErrorMessage error={getFieldError("country")} />
                  </div>

                  <div id="field-stateOfOrigin">
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      State of Origin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.stateOfOrigin}
                      onChange={(e) =>
                        handleInputChange("stateOfOrigin", e.target.value)
                      }
                      onBlur={() => handleBlur("stateOfOrigin")}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter state of origin"
                    />
                    <ErrorMessage error={getFieldError("stateOfOrigin")} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Residential State
                    </label>
                    <input
                      type="text"
                      value={formData.residentialState}
                      onChange={(e) =>
                        handleInputChange("residentialState", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter residential state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      LGA
                    </label>
                    <input
                      type="text"
                      value={formData.lga}
                      onChange={(e) => handleInputChange("lga", e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter LGA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent resize-none"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Church Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">
                  Church Information
                </h3>
                <p className="text-sm text-[#8F9BB3]">
                  Provide church-related details and memberships
                </p>
              </div>

              <div id="field-memberStatus">
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Member Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Active", "Pre Youth", "Baptized", "ETS"].map((status) => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.memberStatus.includes(status)
                          ? "border-[#009AF4] bg-[#009AF4]/5"
                          : "border-[#EDF1F7] hover:border-[#009AF4]/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.memberStatus.includes(status)}
                        onChange={() =>
                          handleMultiSelectChange("memberStatus", status)
                        }
                        className="w-4 h-4 text-[#009AF4] rounded focus:ring-[#009AF4]"
                      />
                      <span className="text-sm font-medium text-[#222B45]">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
                <ErrorMessage error={getFieldError("memberStatus")} />
              </div>

              <div id="field-baptismStatus">
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Baptism Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.baptismStatus}
                  onChange={(e) =>
                    handleInputChange("baptismStatus", e.target.value)
                  }
                  onBlur={() => handleBlur("baptismStatus")}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                >
                  <option value="">Select baptism status</option>
                  <option value="baptized">Baptized</option>
                  <option value="not_baptized">Not Baptized</option>
                  <option value="pending">Pending Baptism</option>
                </select>
                <ErrorMessage error={getFieldError("baptismStatus")} />
              </div>

              {formData.baptismStatus === "baptized" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Baptism Location
                    </label>
                    <input
                      type="text"
                      value={formData.baptismLocation}
                      onChange={(e) =>
                        handleInputChange("baptismLocation", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent bg-white"
                      placeholder="Enter baptism location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Baptism Date
                    </label>
                    <input
                      type="date"
                      value={formData.baptismDate}
                      onChange={(e) =>
                        handleInputChange("baptismDate", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              )}

              <div id="field-presentBand">
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Present Band
                </label>
                {!bandEligible && (
                  <div className="flex items-start gap-2 mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium">
                        Band selection is currently disabled
                      </p>
                      <p className="text-xs mt-1">
                        Please enter date of birth and baptism status to enable
                        band selection
                      </p>
                    </div>
                  </div>
                )}
                <select
                  value={formData.presentBand}
                  onChange={(e) =>
                    handleInputChange("presentBand", e.target.value)
                  }
                  onBlur={() => handleBlur("presentBand")}
                  disabled={!bandEligible}
                  className={`w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                    !bandEligible
                      ? "bg-[#F7F9FC] cursor-not-allowed opacity-60"
                      : ""
                  }`}
                >
                  <option value="">Select band</option>
                  <option value="choir">Choir Band</option>
                  <option value="youth">Youth Band</option>
                  <option value="children">Children's Band</option>
                  <option value="men">Men's Band</option>
                  <option value="women">Women's Band</option>
                </select>
                <ErrorMessage error={getFieldError("presentBand")} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Units
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Music Ministry",
                    "Media Team",
                    "Ushering",
                    "Teaching",
                    "Protocol",
                    "First Aid",
                  ].map((unit) => (
                    <label
                      key={unit}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.units.includes(unit)
                          ? "border-[#009AF4] bg-[#009AF4]/5"
                          : "border-[#EDF1F7] hover:border-[#009AF4]/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.units.includes(unit)}
                        onChange={() => handleMultiSelectChange("units", unit)}
                        className="w-4 h-4 text-[#009AF4] rounded focus:ring-[#009AF4]"
                      />
                      <span className="text-sm font-medium text-[#222B45]">
                        {unit}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Membership Path
                </label>
                <select
                  value={formData.membershipPath}
                  onChange={(e) =>
                    handleInputChange("membershipPath", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                >
                  <option value="">Select membership path</option>
                  <option value="transfer">Transfer</option>
                  <option value="new_convert">New Convert</option>
                  <option value="birth">Birth</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Academics and Work */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">
                  Academic & Work Information
                </h3>
                <p className="text-sm text-[#8F9BB3]">
                  Add education and employment details (optional)
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  All fields in this section are optional. You can skip this
                  step and add these details later from the member's profile.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-[#222B45]">
                  Educational Background
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) =>
                        handleInputChange("institution", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter institution name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Course / Program
                    </label>
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) =>
                        handleInputChange("course", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter course of study"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Qualification
                    </label>
                    <select
                      value={formData.qualification}
                      onChange={(e) =>
                        handleInputChange("qualification", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    >
                      <option value="">Select qualification</option>
                      <option value="high_school">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDF1F7] space-y-4">
                <h4 className="font-medium text-[#222B45]">
                  Employment Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Place of Work
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfWork}
                      onChange={(e) =>
                        handleInputChange("placeOfWork", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter company/organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Office Address
                    </label>
                    <textarea
                      value={formData.officeAddress}
                      onChange={(e) =>
                        handleInputChange("officeAddress", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent resize-none"
                      placeholder="Enter office address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review and Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">
                  Review & Submit
                </h3>
                <p className="text-sm text-[#8F9BB3]">
                  Please review all information before submitting
                </p>
              </div>

              {/* Bio Data Review */}
              <div className="p-4 sm:p-5 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7] overflow-x-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h4 className="font-semibold text-[#222B45] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#009AF4]" />
                    Personal Information
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    className="text-[#009AF4] hover:text-[#0086D6] w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ReviewField
                    label="Full Name"
                    value={`${formData.firstName} ${formData.middleName} ${formData.surname}`.trim()}
                  />
                  <ReviewField label="Email" value={formData.email} />
                  <ReviewField label="Phone" value={formData.phone} />
                  <ReviewField label="Gender" value={formData.gender} />
                  <ReviewField
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                  />
                  <ReviewField
                    label="Age"
                    value={age !== null ? `${age} years` : "N/A"}
                  />
                  <ReviewField
                    label="Marital Status"
                    value={formData.maritalStatus}
                  />
                  <ReviewField label="Country" value={formData.country} />
                  <ReviewField
                    label="State of Origin"
                    value={formData.stateOfOrigin}
                  />
                  <ReviewField label="City" value={formData.city || "N/A"} />
                </div>
              </div>

              {/* Church Information Review */}
              <div className="p-4 sm:p-5 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h4 className="font-semibold text-[#222B45] flex items-center gap-2">
                    <Church className="w-5 h-5 text-[#009AF4]" />
                    Church Information
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="text-[#009AF4] hover:text-[#0086D6] w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#8F9BB3] mb-1">
                      Member Status
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.memberStatus.length > 0 ? (
                        formData.memberStatus.map((status) => (
                          <Badge
                            key={status}
                            variant="outline"
                            className="bg-[#009AF4]/10 text-[#009AF4] border-[#009AF4]/30"
                          >
                            {status}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[#8F9BB3]">
                          None selected
                        </span>
                      )}
                    </div>
                  </div>
                  <ReviewField
                    label="Baptism Status"
                    value={formData.baptismStatus}
                  />
                  <ReviewField
                    label="Present Band"
                    value={formData.presentBand || "Not assigned"}
                  />
                  <div>
                    <p className="text-xs font-medium text-[#8F9BB3] mb-1">
                      Units
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.units.length > 0 ? (
                        formData.units.map((unit) => (
                          <Badge
                            key={unit}
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {unit}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[#8F9BB3]">
                          None selected
                        </span>
                      )}
                    </div>
                  </div>
                  <ReviewField
                    label="Membership Path"
                    value={formData.membershipPath || "N/A"}
                  />
                </div>
              </div>

              {/* Academics and Work Review */}
              <div className="p-4 sm:p-5 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h4 className="font-semibold text-[#222B45] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#009AF4]" />
                    Academic & Work Information
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(3)}
                    className="text-[#009AF4] hover:text-[#0086D6] w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ReviewField
                    label="Institution"
                    value={formData.institution || "N/A"}
                  />
                  <ReviewField
                    label="Course"
                    value={formData.course || "N/A"}
                  />
                  <ReviewField
                    label="Qualification"
                    value={formData.qualification || "N/A"}
                  />
                  <ReviewField
                    label="Place of Work"
                    value={formData.placeOfWork || "N/A"}
                  />
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Please verify all information</p>
                  <p className="text-xs mt-1">
                    Once submitted, this member will be added to the system. You
                    can edit their details later from their profile page.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isCreating}
              className="w-full sm:w-auto border-[#222B45] text-[#222B45] hover:bg-[#222B45] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="text-sm text-[#8F9BB3] order-first sm:order-0 mb-2 sm:mb-0">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={isCreating}
                className="w-full sm:w-auto bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 sm:ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isCreating}
                className="w-full sm:w-auto bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submit Member
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ReviewFieldProps {
  label: string;
  value: string;
}

function ReviewField({ label, value }: ReviewFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8F9BB3] mb-1">{label}</p>
      <p className="text-sm text-[#222B45] wrap-break-word capitalize">
        {value || "N/A"}
      </p>
    </div>
  );
}