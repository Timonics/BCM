"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Briefcase, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditDepartmentModal() {
    const isOpen = true; // Replace with actual state management
    const router = useRouter();
    const onClose = () => {
      router.push(`/dashboard/departments`);
    };
  const department = {
    name: "",
    category: "Ministry",
    headOfDepartment: "",
    description: "",
    meetingDay: "Sunday",
    meetingTime: "",
    status: "Active",
  };
  const [formData, setFormData] = useState({
    name: "",
    category: "Ministry",
    headOfDepartment: "",
    description: "",
    meetingDay: "Sunday",
    meetingTime: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
      setFormData({
        name: department.name || "",
        category: department.category || "Ministry",
        headOfDepartment: department.headOfDepartment || "",
        description: department.description || "",
        meetingDay: department.meetingDay || "Sunday",
        meetingTime: department.meetingTime || "",
        status: department.status || "Active",
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }

    if (!formData.headOfDepartment.trim()) {
      newErrors.headOfDepartment = "Head of Department is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault;
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <Card className="w-full max-w-2xl bg-white shadow-xl my-8">
          <CardHeader className="border-b border-[#EDF1F7]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-[#222B45]">
                    Edit Department
                  </CardTitle>
                  <p className="text-sm text-[#8F9BB3] mt-1">
                    Update department information
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#8F9BB3] hover:text-[#222B45] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Department Name */}
              <div>
                <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                  Department Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Youth Department"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] ${
                    errors.name ? "border-red-500" : "border-[#EDF1F7]"
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                >
                  <option value="Ministry">Ministry</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Support">Support</option>
                  <option value="Outreach">Outreach</option>
                </select>
              </div>

              {/* Head of Department */}
              <div>
                <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                  Head of Department *
                </label>
                <input
                  type="text"
                  name="headOfDepartment"
                  value={formData.headOfDepartment}
                  onChange={handleChange}
                  placeholder="e.g., Brother John Doe"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] ${
                    errors.headOfDepartment
                      ? "border-red-500"
                      : "border-[#EDF1F7]"
                  }`}
                />
                {errors.headOfDepartment && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.headOfDepartment}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the department's purpose and activities..."
                  rows={4}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] ${
                    errors.description ? "border-red-500" : "border-[#EDF1F7]"
                  }`}
                />
                {errors.description && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Meeting Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                    Meeting Day
                  </label>
                  <select
                    name="meetingDay"
                    value={formData.meetingDay}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                    Meeting Time
                  </label>
                  <input
                    type="time"
                    name="meetingTime"
                    value={formData.meetingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-[#222B45] mb-2 block">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDF1F7]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#EDF1F7]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Update Department
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
