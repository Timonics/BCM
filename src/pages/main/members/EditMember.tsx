import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  AlertTriangle,
  Clock,
  X,
  Shield,
  History,
} from 'lucide-react';

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
  suspensionStatus: boolean;
  
  // Academics and Work
  institution: string;
  course: string;
  qualification: string;
  startDate: string;
  endDate: string;
  placeOfWork: string;
  officeAddress: string;
}

interface AuditInfo {
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  createdBy: string;
  createdAt: string;
}

interface EditMemberFormProps {
  memberId?: string;
  onCancel?: () => void;
}

export default function EditMember({ memberId = 'BCM1004', onCancel }: EditMemberFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [bandEligible, setBandEligible] = useState(false);
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  
  // Mock audit info
  const [auditInfo] = useState<AuditInfo>({
    lastUpdatedBy: 'Admin User',
    lastUpdatedAt: '2025-01-15 14:30:00',
    createdBy: 'Sarah Admin',
    createdAt: '2023-06-20 10:15:00',
  });

  // Mock existing member data (pre-populated)
  const [originalData] = useState<FormData>({
    firstName: 'James',
    middleName: 'Emmanuel',
    surname: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '+234 803 456 7890',
    gender: 'male',
    dateOfBirth: '1997-03-15',
    maritalStatus: 'single',
    country: 'Nigeria',
    stateOfOrigin: 'Lagos',
    residentialState: 'Lagos',
    city: 'Ikeja',
    lga: 'Ikeja',
    address: '45 Allen Avenue, Ikeja',
    memberStatus: ['Baptism', 'ETS', 'Active'],
    presentBand: 'youth',
    units: ['Teaching'],
    baptismStatus: 'baptized',
    baptismLocation: 'BCM Lagos',
    baptismDate: '2015-08-12',
    membershipPath: 'birth',
    suspensionStatus: false,
    institution: 'University of Lagos',
    course: 'Computer Science',
    qualification: 'bachelor',
    startDate: '2015-09-01',
    endDate: '2019-07-15',
    placeOfWork: 'Tech Solutions Ltd',
    officeAddress: '12 Marina, Lagos Island',
  });

  const [formData, setFormData] = useState<FormData>(originalData);

  const steps = [
    { number: 1, title: 'Bio Data', icon: User },
    { number: 2, title: 'Church Information', icon: Church },
    { number: 3, title: 'Academics & Work', icon: Briefcase },
    { number: 4, title: 'Review & Submit', icon: FileCheck },
  ];

  const sensitiveFields = ['presentBand', 'suspensionStatus', 'memberStatus', 'baptismStatus'];

  // Calculate age from date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge >= 0 ? calculatedAge : null);
    } else {
      setAge(null);
    }
  }, [formData.dateOfBirth]);

  // Check band eligibility
  useEffect(() => {
    const isEligible = age !== null && formData.baptismStatus !== '';
    setBandEligible(isEligible);
    
    if (!isEligible && formData.presentBand && formData.presentBand !== originalData.presentBand) {
      setFormData(prev => ({ ...prev, presentBand: originalData.presentBand }));
    }
  }, [age, formData.baptismStatus]);

  // Track sensitive changes
  useEffect(() => {
    let hasSensitiveChange = false;
    sensitiveFields.forEach(field => {
      const currentValue = formData[field as keyof FormData];
      const originalValue = originalData[field as keyof FormData];
      
      if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
        hasSensitiveChange = true;
      }
    });
    setShowSensitiveWarning(hasSensitiveChange);
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setChangedFields(prev => new Set(prev).add(field));
  };

  const handleMultiSelectChange = (field: keyof FormData, value: string) => {
    const currentValues = formData[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFormData(prev => ({ ...prev, [field]: newValues }));
    setChangedFields(prev => new Set(prev).add(field));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Changed fields:', Array.from(changedFields));
    // Handle form submission
  };

  const isFieldChanged = (field: keyof FormData): boolean => {
    return JSON.stringify(formData[field]) !== JSON.stringify(originalData[field]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with Audit Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-[#222B45]">Edit Member</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {memberId}
            </Badge>
          </div>
          <p className="text-[#8F9BB3] mt-1">Update member information and save changes</p>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="border-[#EDF1F7]">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* Audit Badge */}
      <Card className="border-[#EDF1F7] shadow-sm bg-[#F7F9FC]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8F9BB3]" />
                <div>
                  <p className="text-xs text-[#8F9BB3]">Last Updated</p>
                  <p className="text-sm font-medium text-[#222B45]">{formatDate(auditInfo.lastUpdatedAt)}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#EDF1F7]" />
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8F9BB3]" />
                <div>
                  <p className="text-xs text-[#8F9BB3]">Updated By</p>
                  <p className="text-sm font-medium text-[#222B45]">{auditInfo.lastUpdatedBy}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-[#009AF4] hover:text-[#0086D6]">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sensitive Changes Warning */}
      {showSensitiveWarning && (
        <Card className="border-orange-200 shadow-sm bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-1">Sensitive Changes Detected</h4>
                <p className="text-sm text-orange-800">
                  You are making changes to sensitive fields (band assignment, suspension status, or member status). 
                  These changes will be logged and may require additional approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  {/* Step Item */}
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-[#009AF4] text-white'
                          : 'bg-[#EDF1F7] text-[#8F9BB3]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? 'text-[#009AF4]' : isCompleted ? 'text-green-600' : 'text-[#8F9BB3]'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-[#8F9BB3] mt-0.5">Step {step.number}</p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 px-4 pb-8">
                      <div
                        className={`h-0.5 ${
                          currentStep > step.number ? 'bg-green-500' : 'bg-[#EDF1F7]'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-8">
          {/* Step 1: Bio Data */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">Personal Information</h3>
                <p className="text-sm text-[#8F9BB3]">Update the member's basic personal details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    First Name <span className="text-red-500">*</span>
                    {isFieldChanged('firstName') && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                        Modified
                      </Badge>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                      isFieldChanged('firstName') ? 'border-yellow-300 bg-yellow-50' : 'border-[#EDF1F7]'
                    }`}
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Middle / Baptism Name
                    {isFieldChanged('middleName') && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                        Modified
                      </Badge>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                      isFieldChanged('middleName') ? 'border-yellow-300 bg-yellow-50' : 'border-[#EDF1F7]'
                    }`}
                    placeholder="Enter middle name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Surname <span className="text-red-500">*</span>
                    {isFieldChanged('surname') && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                        Modified
                      </Badge>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                      isFieldChanged('surname') ? 'border-yellow-300 bg-yellow-50' : 'border-[#EDF1F7]'
                    }`}
                    placeholder="Enter surname"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Email Address <span className="text-red-500">*</span>
                    {isFieldChanged('email') && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                        Modified
                      </Badge>
                    )}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                      isFieldChanged('email') ? 'border-yellow-300 bg-yellow-50' : 'border-[#EDF1F7]'
                    }`}
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Phone Number <span className="text-red-500">*</span>
                    {isFieldChanged('phone') && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                        Modified
                      </Badge>
                    )}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                      isFieldChanged('phone') ? 'border-yellow-300 bg-yellow-50' : 'border-[#EDF1F7]'
                    }`}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                    {isFieldChanged('dateOfBirth') && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                        Modified
                      </Badge>
                    )}
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                      isFieldChanged('dateOfBirth') ? 'border-yellow-300 bg-yellow-50' : 'border-[#EDF1F7]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Age
                  </label>
                  <div className="px-4 py-2.5 border border-[#EDF1F7] rounded-lg bg-[#F7F9FC] text-[#222B45] font-medium">
                    {age !== null ? `${age} years` : 'Auto-calculated'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                >
                  <option value="">Select marital status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#EDF1F7]">
                <h4 className="font-medium text-[#222B45] mb-4">Location Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      State of Origin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.stateOfOrigin}
                      onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter state of origin"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Residential State
                    </label>
                    <input
                      type="text"
                      value={formData.residentialState}
                      onChange={(e) => handleInputChange('residentialState', e.target.value)}
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
                      onChange={(e) => handleInputChange('city', e.target.value)}
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
                      onChange={(e) => handleInputChange('lga', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter LGA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
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
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">Church Information</h3>
                <p className="text-sm text-[#8F9BB3]">Update church-related details and memberships</p>
              </div>

              {/* Sensitive Field Warning */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium">Sensitive Section</p>
                  <p className="text-xs mt-1">Changes to member status, band assignment, and suspension status are tracked and may require approval.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Member Status <span className="text-red-500">*</span>
                  {isFieldChanged('memberStatus') && (
                    <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Sensitive Change
                    </Badge>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Active', 'Pre Youth', 'Baptized', 'ETS'].map((status) => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.memberStatus.includes(status)
                          ? 'border-[#009AF4] bg-[#009AF4]/5'
                          : 'border-[#EDF1F7] hover:border-[#009AF4]/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.memberStatus.includes(status)}
                        onChange={() => handleMultiSelectChange('memberStatus', status)}
                        className="w-4 h-4 text-[#009AF4] rounded focus:ring-[#009AF4]"
                      />
                      <span className="text-sm font-medium text-[#222B45]">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Baptism Status <span className="text-red-500">*</span>
                  {isFieldChanged('baptismStatus') && (
                    <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Sensitive Change
                    </Badge>
                  )}
                </label>
                <select
                  value={formData.baptismStatus}
                  onChange={(e) => handleInputChange('baptismStatus', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                    isFieldChanged('baptismStatus') ? 'border-orange-300 bg-orange-50' : 'border-[#EDF1F7]'
                  }`}
                >
                  <option value="">Select baptism status</option>
                  <option value="baptized">Baptized</option>
                  <option value="not_baptized">Not Baptized</option>
                  <option value="pending">Pending Baptism</option>
                </select>
              </div>

              {formData.baptismStatus === 'baptized' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Baptism Location
                    </label>
                    <input
                      type="text"
                      value={formData.baptismLocation}
                      onChange={(e) => handleInputChange('baptismLocation', e.target.value)}
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
                      onChange={(e) => handleInputChange('baptismDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Present Band
                  {isFieldChanged('presentBand') && (
                    <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Sensitive Change
                    </Badge>
                  )}
                </label>
                {!bandEligible && (
                  <div className="flex items-start gap-2 mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium">Band selection is currently disabled</p>
                      <p className="text-xs mt-1">Please ensure date of birth and baptism status are set to enable band selection</p>
                    </div>
                  </div>
                )}
                <select
                  value={formData.presentBand}
                  onChange={(e) => handleInputChange('presentBand', e.target.value)}
                  disabled={!bandEligible}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent ${
                    !bandEligible ? 'bg-[#F7F9FC] cursor-not-allowed opacity-60' : isFieldChanged('presentBand') ? 'border-orange-300 bg-orange-50' : 'border-[#EDF1F7]'
                  }`}
                >
                  <option value="">Select band</option>
                  <option value="choir">Choir Band</option>
                  <option value="youth">Youth Band</option>
                  <option value="children">Children's Band</option>
                  <option value="men">Men's Band</option>
                  <option value="women">Women's Band</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Units
                  {isFieldChanged('units') && (
                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                      Modified
                    </Badge>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Music Ministry', 'Media Team', 'Ushering', 'Teaching', 'Protocol', 'First Aid'].map((unit) => (
                    <label
                      key={unit}
                      className={`flex items-center gap-3 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.units.includes(unit)
                          ? 'border-[#009AF4] bg-[#009AF4]/5'
                          : 'border-[#EDF1F7] hover:border-[#009AF4]/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.units.includes(unit)}
                        onChange={() => handleMultiSelectChange('units', unit)}
                        className="w-4 h-4 text-[#009AF4] rounded focus:ring-[#009AF4]"
                      />
                      <span className="text-sm font-medium text-[#222B45]">{unit}</span>
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
                  onChange={(e) => handleInputChange('membershipPath', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                >
                  <option value="">Select membership path</option>
                  <option value="transfer">Transfer</option>
                  <option value="new_convert">New Convert</option>
                  <option value="birth">Birth</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>

              {/* Suspension Status */}
              <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <label className="text-sm font-semibold text-red-900">
                        Suspension Status
                        {isFieldChanged('suspensionStatus') && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-300 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Critical Change
                          </Badge>
                        )}
                      </label>
                      <p className="text-xs text-red-700 mt-0.5">This action requires administrative approval</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.suspensionStatus}
                      onChange={(e) => handleInputChange('suspensionStatus', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Academics and Work */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">Academic & Work Information</h3>
                <p className="text-sm text-[#8F9BB3]">Update education and employment details</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-[#222B45]">Educational Background</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
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
                      onChange={(e) => handleInputChange('course', e.target.value)}
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
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
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
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
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
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EDF1F7] space-y-4">
                <h4 className="font-medium text-[#222B45]">Employment Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Place of Work
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfWork}
                      onChange={(e) => handleInputChange('placeOfWork', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
                      placeholder="Enter company/organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#222B45] mb-2">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={formData.officeAddress}
                      onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent"
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
                <h3 className="text-lg font-semibold text-[#222B45] mb-1">Review Changes & Submit</h3>
                <p className="text-sm text-[#8F9BB3]">Review all changes before saving</p>
              </div>

              {/* Changes Summary */}
              {changedFields.size > 0 && (
                <Card className="border-blue-200 shadow-sm bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          {changedFields.size} Change{changedFields.size !== 1 ? 's' : ''} Detected
                        </h4>
                        <p className="text-sm text-blue-800">
                          You have modified {changedFields.size} field{changedFields.size !== 1 ? 's' : ''}. All changes will be logged with your user ID and timestamp.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bio Data Review */}
              <div className="p-5 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[#222B45] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#009AF4]" />
                    Personal Information
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                    className="text-[#009AF4] hover:text-[#0086D6]"
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewField label="Full Name" value={`${formData.firstName} ${formData.middleName} ${formData.surname}`} isChanged={isFieldChanged('firstName') || isFieldChanged('middleName') || isFieldChanged('surname')} />
                  <ReviewField label="Email" value={formData.email} isChanged={isFieldChanged('email')} />
                  <ReviewField label="Phone" value={formData.phone} isChanged={isFieldChanged('phone')} />
                  <ReviewField label="Gender" value={formData.gender} isChanged={isFieldChanged('gender')} />
                  <ReviewField label="Date of Birth" value={formData.dateOfBirth} isChanged={isFieldChanged('dateOfBirth')} />
                  <ReviewField label="Age" value={age !== null ? `${age} years` : 'N/A'} />
                  <ReviewField label="Marital Status" value={formData.maritalStatus} isChanged={isFieldChanged('maritalStatus')} />
                  <ReviewField label="Country" value={formData.country} isChanged={isFieldChanged('country')} />
                </div>
              </div>

              {/* Church Information Review */}
              <div className="p-5 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[#222B45] flex items-center gap-2">
                    <Church className="w-5 h-5 text-[#009AF4]" />
                    Church Information
                    {(isFieldChanged('memberStatus') || isFieldChanged('presentBand') || isFieldChanged('suspensionStatus')) && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Sensitive Changes
                      </Badge>
                    )}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(2)}
                    className="text-[#009AF4] hover:text-[#0086D6]"
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#8F9BB3] mb-1">
                      Member Status
                      {isFieldChanged('memberStatus') && (
                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                          Modified
                        </Badge>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.memberStatus.length > 0 ? (
                        formData.memberStatus.map((status) => (
                          <Badge key={status} variant="outline" className="bg-[#009AF4]/10 text-[#009AF4] border-[#009AF4]/30">
                            {status}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[#8F9BB3]">None selected</span>
                      )}
                    </div>
                  </div>
                  <ReviewField label="Present Band" value={formData.presentBand || 'Not assigned'} isChanged={isFieldChanged('presentBand')} />
                  <div>
                    <p className="text-xs font-medium text-[#8F9BB3] mb-1">Units</p>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.units.length > 0 ? (
                        formData.units.map((unit) => (
                          <Badge key={unit} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {unit}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-[#8F9BB3]">None selected</span>
                      )}
                    </div>
                  </div>
                  <ReviewField label="Suspension Status" value={formData.suspensionStatus ? 'Suspended' : 'Active'} isChanged={isFieldChanged('suspensionStatus')} isSensitive={formData.suspensionStatus} />
                </div>
              </div>

              {/* Academics and Work Review */}
              <div className="p-5 bg-[#F7F9FC] rounded-lg border border-[#EDF1F7]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-[#222B45] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#009AF4]" />
                    Academic & Work Information
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(3)}
                    className="text-[#009AF4] hover:text-[#0086D6]"
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewField label="Institution" value={formData.institution || 'N/A'} isChanged={isFieldChanged('institution')} />
                  <ReviewField label="Course" value={formData.course || 'N/A'} isChanged={isFieldChanged('course')} />
                  <ReviewField label="Qualification" value={formData.qualification || 'N/A'} isChanged={isFieldChanged('qualification')} />
                  <ReviewField label="Place of Work" value={formData.placeOfWork || 'N/A'} isChanged={isFieldChanged('placeOfWork')} />
                </div>
              </div>

              {/* Final Confirmation */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Confirm Changes</p>
                  <p className="text-xs mt-1">By clicking "Save Changes", you confirm that all information is accurate. This update will be logged in the member's history.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-[#222B45] text-[#222B45] hover:bg-[#222B45] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-[#8F9BB3]">
              Step {currentStep} of {steps.length}
              {changedFields.size > 0 && (
                <span className="ml-2 text-[#009AF4]">• {changedFields.size} change{changedFields.size !== 1 ? 's' : ''}</span>
              )}
            </div>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
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
  isChanged?: boolean;
  isSensitive?: boolean;
}

function ReviewField({ label, value, isChanged = false, isSensitive = false }: ReviewFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8F9BB3] mb-1">
        {label}
        {isChanged && (
          <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            Modified
          </Badge>
        )}
        {isSensitive && (
          <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200 text-xs">
            Suspended
          </Badge>
        )}
      </p>
      <p className="text-sm text-[#222B45] capitalize">{value || 'N/A'}</p>
    </div>
  );
}
