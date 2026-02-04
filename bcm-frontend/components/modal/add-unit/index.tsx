"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Grid3x3,
  CheckCircle,
  Info,
  AlertCircle,
  Crown,
} from 'lucide-react';

interface AddNewUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (unitData: UnitFormData) => void;
}

interface UnitFormData {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  defaultLeadershipRoles: string[];
}

export default function AddNewUnitModal({
  isOpen,
  onClose,
  onSave,
}: AddNewUnitModalProps) {
  const [formData, setFormData] = useState<UnitFormData>({
    name: '',
    code: '',
    description: '',
    isActive: true,
    defaultLeadershipRoles: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const availableLeadershipRoles = [
    { id: 'head', label: 'Head of Unit', description: 'Primary leader and coordinator' },
    { id: 'assistant', label: 'Assistant Head', description: 'Supports the head and acts in their absence' },
    { id: 'secretary', label: 'Secretary', description: 'Manages records and communications' },
  ];

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'Unit name is required';
        }
        if (value.length < 3) {
          return 'Unit name must be at least 3 characters';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate the field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const toggleLeadershipRole = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      defaultLeadershipRoles: prev.defaultLeadershipRoles.includes(roleId)
        ? prev.defaultLeadershipRoles.filter(r => r !== roleId)
        : [...prev.defaultLeadershipRoles, roleId],
    }));
  };

  const isFormValid = () => {
    // Check required fields
    if (!formData.name || formData.name.trim() === '') return false;
    if (formData.name.length < 3) return false;

    // Check if there are any errors
    return Object.values(errors).every(error => error === '');
  };

  const handleSave = () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      code: true,
    });

    if (isFormValid()) {
      onSave?.(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      code: '',
      description: '',
      isActive: true,
      defaultLeadershipRoles: [],
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-[#009AF4]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">Add New Unit</h2>
              <p className="text-sm text-[#8F9BB3] mt-0.5">
                Create a new church unit with default leadership structure
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#EDF1F7] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#8F9BB3]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  1
                </div>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Unit Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Unit Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g., Teaching Unit, Media Team, Welfare Unit"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm ${
                      touched.name && errors.name
                        ? 'border-red-300 bg-red-50'
                        : 'border-[#EDF1F7]'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Unit Code */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Unit Code or Abbreviation <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="e.g., TCH, MED, WEL"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-[#8F9BB3] mt-1">
                    Short code for quick identification and reports
                  </p>
                </div>

                {/* Unit Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Unit Description <span className="text-[#8F9BB3] text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the unit's purpose, responsibilities, and activities..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm resize-none"
                  />
                  <p className="text-xs text-[#8F9BB3] mt-1">
                    {formData.description.length} / 500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Default Leadership Roles Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  2
                </div>
                Default Leadership Roles
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs ml-2">
                  Optional
                </Badge>
              </h3>

              <Card className="border-blue-200 bg-blue-50 mb-4">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900">
                      <p className="font-medium mb-1">Leadership Roles Setup</p>
                      <p className="text-blue-800">
                        Select the default leadership positions for this unit. These roles can be assigned to members later. 
                        You can also add custom roles after the unit is created.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {availableLeadershipRoles.map((role) => (
                  <label
                    key={role.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#009AF4]/50 ${
                      formData.defaultLeadershipRoles.includes(role.id)
                        ? 'border-[#009AF4] bg-[#009AF4]/5'
                        : 'border-[#EDF1F7]'
                    }`}
                  >
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        checked={formData.defaultLeadershipRoles.includes(role.id)}
                        onChange={() => toggleLeadershipRole(role.id)}
                        className="w-5 h-5 text-[#009AF4] border-[#EDF1F7] rounded focus:ring-[#009AF4] focus:ring-2"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#222B45]">{role.label}</span>
                        {formData.defaultLeadershipRoles.includes(role.id) && (
                          <CheckCircle className="w-4 h-4 text-[#009AF4]" />
                        )}
                      </div>
                      <p className="text-xs text-[#8F9BB3] mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {formData.defaultLeadershipRoles.length > 0 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-green-900 font-medium">
                        {formData.defaultLeadershipRoles.length} leadership role{formData.defaultLeadershipRoles.length > 1 ? 's' : ''} selected
                      </p>
                      <p className="text-xs text-green-800 mt-1">
                        These roles will be available for assignment when you add members to this unit.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unit Status Section */}
            <div>
              <h3 className="text-sm font-semibold text-[#222B45] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#009AF4] text-white flex items-center justify-center text-xs">
                  3
                </div>
                Unit Status
              </h3>

              <div className="flex items-center justify-between p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-[#222B45] text-sm">Status</p>
                  <p className="text-xs text-[#8F9BB3] mt-0.5">
                    {formData.isActive 
                      ? 'Unit is active and available for member assignment' 
                      : 'Unit is inactive and not available for member assignment'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={
                    formData.isActive 
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EDF1F7] p-6 bg-white">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-[#EDF1F7] hover:border-[#222B45] hover:text-[#222B45]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid()}
              className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Save Unit
            </Button>
          </div>
          {!isFormValid() && Object.keys(touched).length > 0 && (
            <p className="text-xs text-red-600 text-center mt-3">
              Please fill in all required fields correctly
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
