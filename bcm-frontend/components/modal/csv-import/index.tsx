"use client"

import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  X,
  Download,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  Info,
  FileCheck,
  Shuffle,
  Eye,
  ChevronRight,
} from "lucide-react";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (data: any) => void;
}

interface MappingOption {
  csvColumn: string;
  dbField: string;
}

interface PreviewRow {
  id: number;
  data: Record<string, string>;
  hasError: boolean;
  errors: string[];
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onImportComplete,
}: CSVImportModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<MappingOption[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importStats, setImportStats] = useState({
    total: 0,
    success: 0,
    errors: 0,
  });

  const steps = [
    { number: 1, title: "Download Template", icon: Download },
    { number: 2, title: "Upload File", icon: Upload },
    { number: 3, title: "Field Mapping", icon: Shuffle },
    { number: 4, title: "Preview", icon: Eye },
    { number: 5, title: "Confirm", icon: Check },
  ];

  // Mock CSV columns detected from uploaded file
  const detectedColumns = [
    "Full Name",
    "Email Address",
    "Phone Number",
    "Date of Birth",
    "Gender",
    "Band",
    "Status",
  ];

  // Database fields available for mapping
  const dbFields = [
    { value: "firstName", label: "First Name" },
    { value: "surname", label: "Surname" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "dateOfBirth", label: "Date of Birth" },
    { value: "gender", label: "Gender" },
    { value: "presentBand", label: "Present Band" },
    { value: "memberStatus", label: "Member Status" },
    { value: "address", label: "Address" },
    { value: "city", label: "City" },
    { value: "state", label: "State" },
    { value: "country", label: "Country" },
    { value: "maritalStatus", label: "Marital Status" },
    { value: "skip", label: "-- Skip This Column --" },
  ];

  // Mock preview data with some error rows
  const previewData: PreviewRow[] = [
    {
      id: 1,
      data: {
        "Full Name": "John Smith",
        "Email Address": "john.smith@email.com",
        "Phone Number": "+234 801 234 5678",
        "Date of Birth": "1995-03-15",
        Gender: "Male",
        Band: "Youth Band",
        Status: "Active",
      },
      hasError: false,
      errors: [],
    },
    {
      id: 2,
      data: {
        "Full Name": "Sarah Johnson",
        "Email Address": "invalid-email",
        "Phone Number": "+234 802 345 6789",
        "Date of Birth": "1998-07-22",
        Gender: "Female",
        Band: "Choir Band",
        Status: "Active",
      },
      hasError: true,
      errors: ["Invalid email format"],
    },
    {
      id: 3,
      data: {
        "Full Name": "Michael Chen",
        "Email Address": "michael.chen@email.com",
        "Phone Number": "invalid-phone",
        "Date of Birth": "1992-11-08",
        Gender: "Male",
        Band: "Unknown Band",
        Status: "Active",
      },
      hasError: true,
      errors: ["Invalid phone format", "Band does not exist"],
    },
    {
      id: 4,
      data: {
        "Full Name": "Emily Davis",
        "Email Address": "emily.davis@email.com",
        "Phone Number": "+234 803 456 7890",
        "Date of Birth": "1997-05-18",
        Gender: "Female",
        Band: "Youth Band",
        Status: "Active",
      },
      hasError: false,
      errors: [],
    },
    {
      id: 5,
      data: {
        "Full Name": "David Wilson",
        "Email Address": "david.wilson@email.com",
        "Phone Number": "+234 804 567 8901",
        "Date of Birth": "invalid-date",
        Gender: "Male",
        Band: "Youth Band",
        Status: "Active",
      },
      hasError: true,
      errors: ["Invalid date format"],
    },
  ];

  const handleDownloadTemplate = () => {
    console.log("Downloading CSV template...");
    // In a real app, this would trigger a file download
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    // Initialize field mappings with detected columns
    const initialMappings = detectedColumns.map((col) => ({
      csvColumn: col,
      dbField: "skip", // Default to skip
    }));
    setFieldMappings(initialMappings);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const updateFieldMapping = (csvColumn: string, dbField: string) => {
    setFieldMappings((prev) =>
      prev.map((mapping) =>
        mapping.csvColumn === csvColumn ? { ...mapping, dbField } : mapping,
      ),
    );
  };

  const handleConfirmImport = () => {
    // Simulate import process
    setImportStats({
      total: previewData.length,
      success: previewData.filter((row) => !row.hasError).length,
      errors: previewData.filter((row) => row.hasError).length,
    });
    setImportSuccess(true);
    setCurrentStep(6); // Move to success step
  };

  const handleClose = () => {
    // Reset state
    setCurrentStep(1);
    setUploadedFile(null);
    setFieldMappings([]);
    setImportSuccess(false);
    setIsDragging(false);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      handleConfirmImport();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 2) return uploadedFile !== null;
    if (currentStep === 3)
      return fieldMappings.some((m) => m.dbField !== "skip");
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
          <div>
            <h2 className="text-2xl font-semibold text-[#222B45]">
              Import Members from CSV
            </h2>
            <p className="text-sm text-[#8F9BB3] mt-1">
              {importSuccess ? "Import completed" : `Step ${currentStep} of 5`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#EDF1F7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8F9BB3]" />
          </button>
        </div>

        {/* Progress Stepper */}
        {!importSuccess && (
          <div className="px-6 py-4 border-b border-[#EDF1F7] bg-[#F7F9FC]">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <React.Fragment key={step.number}>
                    {/* Step Item */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isActive
                              ? "bg-[#009AF4] text-white"
                              : "bg-white border-2 border-[#EDF1F7] text-[#8F9BB3]"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center ${
                          isActive
                            ? "text-[#009AF4] font-medium"
                            : "text-[#8F9BB3]"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 px-2 pb-6">
                        <div
                          className={`h-0.5 ${
                            currentStep > step.number
                              ? "bg-green-500"
                              : "bg-[#EDF1F7]"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Download Template */}
          {currentStep === 1 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                  <Download className="w-10 h-10 text-[#009AF4]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#222B45] mb-2">
                    Download CSV Template
                  </h3>
                  <p className="text-[#8F9BB3]">
                    Start by downloading our CSV template with the correct
                    format and required fields
                  </p>
                </div>
              </div>

              <Card className="border-[#EDF1F7]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Template includes:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          All required fields (First Name, Surname, Email,
                          Phone, etc.)
                        </li>
                        <li>Sample data to guide you</li>
                        <li>Data format requirements</li>
                        <li>Field validation rules</li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Button
                      onClick={handleDownloadTemplate}
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white px-8"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                    <p className="text-xs text-[#8F9BB3] mt-3">
                      File format: .csv • Size: ~2KB
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-medium text-[#222B45]">Required Fields</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "First Name",
                    "Surname",
                    "Email",
                    "Phone",
                    "Gender",
                    "Date of Birth",
                  ].map((field) => (
                    <div
                      key={field}
                      className="flex items-center gap-2 p-3 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-[#222B45]">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#222B45]">
                  Upload CSV File
                </h3>
                <p className="text-[#8F9BB3]">
                  Upload your completed CSV file to begin the import process
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging
                      ? "border-[#009AF4] bg-[#009AF4]/5"
                      : "border-[#EDF1F7] hover:border-[#009AF4]/50"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto bg-[#F7F9FC] rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-[#009AF4]" />
                  </div>
                  <h4 className="font-medium text-[#222B45] mb-2">
                    Drag and drop your CSV file here
                  </h4>
                  <p className="text-sm text-[#8F9BB3] mb-4">or</p>
                  <label htmlFor="file-upload">
                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                    >
                      Browse Files
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <p className="text-xs text-[#8F9BB3] mt-4">
                    Supported format: CSV • Maximum size: 5MB
                  </p>
                </div>
              ) : (
                <Card className="border-[#EDF1F7]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#222B45]">
                            {uploadedFile.name}
                          </p>
                          <p className="text-sm text-[#8F9BB3]">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedFile(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">
                            File uploaded successfully!
                          </p>
                          <p className="text-xs">
                            Detected {detectedColumns.length} columns and{" "}
                            {previewData.length} rows. Click "Next" to proceed
                            to field mapping.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Field Mapping */}
          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#222B45]">
                  Map CSV Fields
                </h3>
                <p className="text-[#8F9BB3]">
                  Match your CSV columns to the database fields
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Important</p>
                  <p className="text-xs mt-1">
                    Ensure each CSV column is mapped to the correct database
                    field. You can skip columns that don't need to be imported.
                  </p>
                </div>
              </div>

              <Card className="border-[#EDF1F7]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {fieldMappings.map((mapping, index) => (
                      <div
                        key={mapping.csvColumn}
                        className="flex items-center gap-4 p-4 bg-[#F7F9FC] rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-xs text-[#8F9BB3] mb-1">
                            CSV Column
                          </p>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#009AF4]" />
                            <p className="font-medium text-[#222B45]">
                              {mapping.csvColumn}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-[#8F9BB3]" />

                        <div className="flex-1">
                          <p className="text-xs text-[#8F9BB3] mb-1">
                            Database Field
                          </p>
                          <select
                            value={mapping.dbField}
                            onChange={(e) =>
                              updateFieldMapping(
                                mapping.csvColumn,
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                          >
                            {dbFields.map((field) => (
                              <option key={field.value} value={field.value}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        {
                          fieldMappings.filter((m) => m.dbField !== "skip")
                            .length
                        }{" "}
                        of {fieldMappings.length} columns mapped
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-300"
                    >
                      {fieldMappings.filter((m) => m.dbField === "skip").length}{" "}
                      skipped
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-[#222B45]">
                  Preview Import Data
                </h3>
                <p className="text-[#8F9BB3]">
                  Review the data before importing. Rows with errors are
                  highlighted.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-[#EDF1F7]">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-semibold text-[#009AF4]">
                      {previewData.length}
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">Total Rows</p>
                  </CardContent>
                </Card>
                <Card className="border-[#EDF1F7]">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-semibold text-green-600">
                      {previewData.filter((row) => !row.hasError).length}
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">Valid Rows</p>
                  </CardContent>
                </Card>
                <Card className="border-[#EDF1F7]">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-semibold text-red-600">
                      {previewData.filter((row) => row.hasError).length}
                    </p>
                    <p className="text-xs text-[#8F9BB3] mt-1">Error Rows</p>
                  </CardContent>
                </Card>
              </div>

              {/* Error Warning */}
              {previewData.some((row) => row.hasError) && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">
                      {previewData.filter((row) => row.hasError).length} rows
                      have validation errors
                    </p>
                    <p className="text-xs text-orange-800 mt-1">
                      Rows with errors will be skipped during import. Fix the
                      errors in your CSV and re-upload to import all rows.
                    </p>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <Card className="border-[#EDF1F7]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase">
                          Status
                        </th>
                        {detectedColumns.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDF1F7]">
                      {previewData.map((row) => (
                        <React.Fragment key={row.id}>
                          <tr className={row.hasError ? "bg-red-50/50" : ""}>
                            <td className="px-4 py-3">
                              {row.hasError ? (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200"
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Error
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Valid
                                </Badge>
                              )}
                            </td>
                            {detectedColumns.map((col) => (
                              <td
                                key={col}
                                className="px-4 py-3 text-sm text-[#222B45]"
                              >
                                {row.data[col]}
                              </td>
                            ))}
                          </tr>
                          {row.hasError && (
                            <tr className="bg-red-50">
                              <td
                                colSpan={detectedColumns.length + 1}
                                className="px-4 py-2"
                              >
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-red-900">
                                      Validation Errors:
                                    </p>
                                    <ul className="text-xs text-red-700 list-disc list-inside mt-1">
                                      {row.errors.map((error, idx) => (
                                        <li key={idx}>{error}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Step 5: Confirm */}
          {currentStep === 5 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#222B45] mb-2">
                    Confirm Import
                  </h3>
                  <p className="text-[#8F9BB3]">
                    Please review the summary before proceeding with the import
                  </p>
                </div>
              </div>

              <Card className="border-[#EDF1F7]">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-lg">
                      <span className="text-sm text-[#8F9BB3]">
                        Total rows to process
                      </span>
                      <span className="text-lg font-semibold text-[#222B45]">
                        {previewData.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-800">
                        Valid rows (will be imported)
                      </span>
                      <span className="text-lg font-semibold text-green-700">
                        {previewData.filter((row) => !row.hasError).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <span className="text-sm text-red-800">
                        Error rows (will be skipped)
                      </span>
                      <span className="text-lg font-semibold text-red-700">
                        {previewData.filter((row) => row.hasError).length}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">What happens next?</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Valid rows will be imported into the database</li>
                          <li>Each member will be assigned a unique ID</li>
                          <li>Error rows will be logged for your review</li>
                          <li>
                            You can download a report after import completes
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Success Step */}
          {currentStep === 6 && importSuccess && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#222B45] mb-2">
                    Import Completed!
                  </h3>
                  <p className="text-[#8F9BB3]">
                    Your member data has been successfully imported
                  </p>
                </div>
              </div>

              <Card className="border-[#EDF1F7]">
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-[#F7F9FC] rounded-lg">
                      <p className="text-2xl font-semibold text-[#222B45]">
                        {importStats.total}
                      </p>
                      <p className="text-xs text-[#8F9BB3] mt-1">
                        Total Processed
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-semibold text-green-600">
                        {importStats.success}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Successfully Imported
                      </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-semibold text-red-600">
                        {importStats.errors}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        Skipped (Errors)
                      </p>
                    </div>
                  </div>

                  {importStats.errors > 0 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-900">
                            {importStats.errors} rows were skipped due to
                            validation errors
                          </p>
                          <p className="text-xs text-orange-800 mt-1">
                            Download the error report to review and fix the
                            issues
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#EDF1F7]"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                    {importStats.errors > 0 && (
                      <Button className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Error Report
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!importSuccess && (
          <div className="border-t border-[#EDF1F7] p-6 bg-white">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-[#222B45] text-[#222B45] hover:bg-[#222B45] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-[#8F9BB3]">
                Step {currentStep} of 5
              </div>

              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 5 ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Import
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
