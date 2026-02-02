import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  X,
  Crown,
  Users,
  Music,
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle,
  Info,
  UserCheck,
  Clock,
  Bell,
  BellRing,
  CircleAlert,
} from 'lucide-react';

interface AssignLeadershipRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (data: LeadershipAssignment) => void;
  memberData?: {
    id: string;
    name: string;
    currentRoles?: string[];
  };
}

interface LeadershipAssignment {
  role: string;
  scopeType: string;
  scopeValue: string;
  startDate: string;
  endDate: string;
  notifyBefore: number;
}

interface RoleOption {
  value: string;
  label: string;
  description: string;
  category: 'Executive' | 'Coordinator' | 'Officer' | 'Assistant';
}

interface ScopeOption {
  type: 'Band' | 'Unit' | 'Class' | 'Church Wide';
  icon: any;
  description: string;
  requiresSelection: boolean;
  options?: { value: string; label: string }[];
}

export default function AssignLeadershipRoleModal({
  isOpen,
  onClose,
  onAssign,
  memberData = {
    id: 'BCM1004',
    name: 'James Wilson',
    currentRoles: ['Youth Band Secretary', 'Teaching Unit Coordinator'],
  },
}: AssignLeadershipRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [scopeType, setScopeType] = useState<string>('');
  const [scopeValue, setScopeValue] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [notifyBefore, setNotifyBefore] = useState(30);
  const [showExpirySettings, setShowExpirySettings] = useState(true);

  // Leadership roles
  const roles: RoleOption[] = [
    // Executive
    { value: 'president', label: 'President', description: 'Overall leadership and direction', category: 'Executive' },
    { value: 'vice-president', label: 'Vice President', description: 'Assists president and covers absences', category: 'Executive' },
    { value: 'general-secretary', label: 'General Secretary', description: 'Records and documentation', category: 'Executive' },
    { value: 'assistant-secretary', label: 'Assistant Secretary', description: 'Supports general secretary', category: 'Executive' },
    { value: 'treasurer', label: 'Treasurer', description: 'Financial management', category: 'Executive' },
    { value: 'financial-secretary', label: 'Financial Secretary', description: 'Financial records and reporting', category: 'Executive' },
    
    // Coordinators
    { value: 'band-coordinator', label: 'Band Coordinator', description: 'Oversees band activities', category: 'Coordinator' },
    { value: 'unit-coordinator', label: 'Unit Coordinator', description: 'Manages unit operations', category: 'Coordinator' },
    { value: 'class-coordinator', label: 'Class Coordinator', description: 'Coordinates class activities', category: 'Coordinator' },
    { value: 'program-coordinator', label: 'Program Coordinator', description: 'Plans and executes programs', category: 'Coordinator' },
    
    // Officers
    { value: 'welfare-officer', label: 'Welfare Officer', description: 'Member care and wellbeing', category: 'Officer' },
    { value: 'protocol-officer', label: 'Protocol Officer', description: 'Event protocol and logistics', category: 'Officer' },
    { value: 'media-officer', label: 'Media Officer', description: 'Communication and publicity', category: 'Officer' },
    { value: 'outreach-officer', label: 'Outreach Officer', description: 'Evangelism and outreach', category: 'Officer' },
    
    // Assistants
    { value: 'assistant-coordinator', label: 'Assistant Coordinator', description: 'Supports coordinators', category: 'Assistant' },
    { value: 'assistant-welfare', label: 'Assistant Welfare Officer', description: 'Supports welfare activities', category: 'Assistant' },
  ];

  // Scope options
  const scopeOptions: ScopeOption[] = [
    {
      type: 'Band',
      icon: Music,
      description: 'Leadership role within a specific band',
      requiresSelection: true,
      options: [
        { value: 'children', label: "Children's Band" },
        { value: 'youth', label: 'Youth Band' },
        { value: 'choir', label: 'Choir Band' },
        { value: 'men', label: "Men's Band" },
        { value: 'women', label: "Women's Band" },
      ],
    },
    {
      type: 'Unit',
      icon: Users,
      description: 'Leadership role within a ministry unit',
      requiresSelection: true,
      options: [
        { value: 'teaching', label: 'Teaching Unit' },
        { value: 'media', label: 'Media Team' },
        { value: 'welfare', label: 'Welfare Unit' },
        { value: 'protocol', label: 'Protocol Unit' },
        { value: 'outreach', label: 'Outreach Unit' },
        { value: 'music', label: 'Music Ministry' },
      ],
    },
    {
      type: 'Class',
      icon: GraduationCap,
      description: 'Leadership role for a specific class',
      requiresSelection: true,
      options: [
        { value: 'bible-study', label: 'Bible Study Class' },
        { value: 'leadership', label: 'Leadership Training' },
        { value: 'new-converts', label: 'New Converts Class' },
        { value: 'sunday-school', label: 'Sunday School' },
      ],
    },
    {
      type: 'Church Wide',
      icon: Building2,
      description: 'Church-wide leadership role',
      requiresSelection: false,
    },
  ];

  // Notification options
  const notificationOptions = [
    { value: 7, label: '1 week before' },
    { value: 14, label: '2 weeks before' },
    { value: 30, label: '1 month before' },
    { value: 60, label: '2 months before' },
    { value: 90, label: '3 months before' },
  ];

  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (!endDate) return null;
    const today = new Date();
    const expiryDate = new Date(endDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = () => {
    const days = getDaysUntilExpiry();
    if (days === null) return null;
    
    if (days < 0) return { type: 'expired', color: 'red', message: 'Role has expired' };
    if (days === 0) return { type: 'today', color: 'red', message: 'Expires today' };
    if (days <= 7) return { type: 'urgent', color: 'red', message: `Expires in ${days} day${days === 1 ? '' : 's'}` };
    if (days <= 30) return { type: 'soon', color: 'orange', message: `Expires in ${days} days` };
    if (days <= 90) return { type: 'upcoming', color: 'yellow', message: `Expires in ${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? '' : 's'}` };
    return { type: 'active', color: 'green', message: `${Math.floor(days / 30)} months remaining` };
  };

  const getCurrentScope = () => scopeOptions.find(s => s.type === scopeType);

  const handleAssign = () => {
    if (!selectedRole || !scopeType || !endDate) return;
    if (getCurrentScope()?.requiresSelection && !scopeValue) return;

    const assignment: LeadershipAssignment = {
      role: selectedRole,
      scopeType,
      scopeValue: getCurrentScope()?.requiresSelection ? scopeValue : 'church-wide',
      startDate,
      endDate,
      notifyBefore,
    };

    onAssign?.(assignment);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setSelectedRole('');
    setScopeType('');
    setScopeValue('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setNotifyBefore(30);
    setShowExpirySettings(true);
    onClose();
  };

  const canProceed = () => {
    if (!selectedRole || !scopeType || !endDate) return false;
    if (getCurrentScope()?.requiresSelection && !scopeValue) return false;
    return true;
  };

  // Reset scope value when scope type changes
  useEffect(() => {
    setScopeValue('');
  }, [scopeType]);

  if (!isOpen) return null;

  const expiryStatus = getExpiryStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDF1F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Crown className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222B45]">Assign Leadership Role</h2>
              <p className="text-sm text-[#8F9BB3] mt-0.5">
                Assign a leadership position with scope and duration
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Member Information */}
          <Card className="border-[#EDF1F7] bg-[#F7F9FC]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#009AF4] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {memberData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#222B45]">{memberData.name}</p>
                    <p className="text-sm text-[#8F9BB3]">{memberData.id}</p>
                  </div>
                </div>
                {memberData.currentRoles && memberData.currentRoles.length > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-[#8F9BB3] mb-1">Current Roles</p>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {memberData.currentRoles.map((role, idx) => (
                        <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Select Role */}
            <div>
              <label className="block text-sm font-medium text-[#222B45] mb-2">
                Leadership Role <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              >
                <option value="">-- Select a role --</option>
                {['Executive', 'Coordinator', 'Officer', 'Assistant'].map(category => (
                  <optgroup key={category} label={category}>
                    {roles
                      .filter(role => role.category === category)
                      .map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label} - {role.description}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              {selectedRole && (
                <p className="text-xs text-[#8F9BB3] mt-2">
                  {roles.find(r => r.value === selectedRole)?.description}
                </p>
              )}
            </div>

            {/* Scope Selection */}
            <div>
              <label className="block text-sm font-medium text-[#222B45] mb-3">
                Scope <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {scopeOptions.map((scope) => {
                  const Icon = scope.icon;
                  const isSelected = scopeType === scope.type;
                  return (
                    <button
                      key={scope.type}
                      onClick={() => setScopeType(scope.type)}
                      className={`p-4 border-2 rounded-lg transition-all text-left ${
                        isSelected
                          ? 'border-[#009AF4] bg-[#009AF4]/5'
                          : 'border-[#EDF1F7] hover:border-[#009AF4]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#009AF4]' : 'bg-[#F7F9FC]'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#009AF4]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isSelected ? 'text-[#009AF4]' : 'text-[#222B45]'}`}>
                            {scope.type}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#009AF4]" />
                        )}
                      </div>
                      <p className="text-xs text-[#8F9BB3]">{scope.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Scope Value Selection */}
              {scopeType && getCurrentScope()?.requiresSelection && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Select {scopeType} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={scopeValue}
                    onChange={(e) => setScopeValue(e.target.value)}
                    className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                  >
                    <option value="">-- Choose {scopeType.toLowerCase()} --</option>
                    {getCurrentScope()?.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full pl-10 pr-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                  />
                </div>
                <p className="text-xs text-[#8F9BB3] mt-1">
                  Leadership roles typically last 1-2 years
                </p>
              </div>
            </div>

            {/* Expiry Notification Settings */}
            {endDate && (
              <Card className="border-[#EDF1F7]">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#009AF4]" />
                      <h4 className="font-semibold text-[#222B45]">Expiry Notification</h4>
                    </div>
                    <button
                      onClick={() => setShowExpirySettings(!showExpirySettings)}
                      className="text-sm text-[#009AF4] hover:underline"
                    >
                      {showExpirySettings ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {showExpirySettings && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#222B45] mb-2">
                          Notify before expiry
                        </label>
                        <select
                          value={notifyBefore}
                          onChange={(e) => setNotifyBefore(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                        >
                          {notificationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-[#8F9BB3] mt-2">
                          Notification will be sent to remind about role expiry
                        </p>
                      </div>

                      {/* Expiry Status Indicator */}
                      {expiryStatus && (
                        <div className={`p-3 rounded-lg border-2 ${
                          expiryStatus.color === 'red' ? 'bg-red-50 border-red-200' :
                          expiryStatus.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                          expiryStatus.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {expiryStatus.type === 'expired' || expiryStatus.type === 'today' || expiryStatus.type === 'urgent' ? (
                              <BellRing className={`w-5 h-5 ${
                                expiryStatus.color === 'red' ? 'text-red-600' : 'text-orange-600'
                              } animate-pulse`} />
                            ) : expiryStatus.type === 'soon' || expiryStatus.type === 'upcoming' ? (
                              <CircleAlert className={`w-5 h-5 ${
                                expiryStatus.color === 'orange' ? 'text-orange-600' : 'text-yellow-600'
                              }`} />
                            ) : (
                              <Clock className="w-5 h-5 text-green-600" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${
                                expiryStatus.color === 'red' ? 'text-red-900' :
                                expiryStatus.color === 'orange' ? 'text-orange-900' :
                                expiryStatus.color === 'yellow' ? 'text-yellow-900' :
                                'text-green-900'
                              }`}>
                                {expiryStatus.message}
                              </p>
                              <p className={`text-xs ${
                                expiryStatus.color === 'red' ? 'text-red-700' :
                                expiryStatus.color === 'orange' ? 'text-orange-700' :
                                expiryStatus.color === 'yellow' ? 'text-yellow-700' :
                                'text-green-700'
                              }`}>
                                End date: {new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <Badge variant="outline" className={
                              expiryStatus.color === 'red' ? 'bg-red-100 text-red-700 border-red-300' :
                              expiryStatus.color === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                              expiryStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                              'bg-green-100 text-green-700 border-green-300'
                            }>
                              {getDaysUntilExpiry()! < 0 ? 'Expired' : 
                               getDaysUntilExpiry()! === 0 ? 'Today' :
                               getDaysUntilExpiry()! <= 30 ? 'Urgent' : 'Active'}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary */}
          {canProceed() && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-2">Assignment Summary</p>
                    <div className="text-xs text-blue-800 space-y-1">
                      <p>
                        <span className="font-medium">{memberData.name}</span> will be assigned as{' '}
                        <span className="font-medium">{roles.find(r => r.value === selectedRole)?.label}</span>
                        {scopeType === 'Church Wide' ? (
                          <span> for the entire church</span>
                        ) : (
                          <span>
                            {' '}for <span className="font-medium">
                              {getCurrentScope()?.options?.find(o => o.value === scopeValue)?.label}
                            </span>
                          </span>
                        )}
                      </p>
                      <p>
                        Term: {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                        {' '}-{' '}
                        {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' '}({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days)
                      </p>
                      <p>
                        Expiry notification will be sent {notificationOptions.find(n => n.value === notifyBefore)?.label}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Box */}
          <Card className="border-[#EDF1F7] bg-[#F7F9FC]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#8F9BB3] shrink-0 mt-0.5" />
                <div className="text-xs text-[#8F9BB3]">
                  <p className="font-medium text-[#222B45] mb-1">Important Notes</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Leadership roles are typically renewed annually or bi-annually</li>
                    <li>Members will be notified before their role expires</li>
                    <li>Multiple roles can be assigned to the same member</li>
                    <li>Role assignments can be extended before expiry</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
              onClick={handleAssign}
              disabled={!canProceed()}
              className="flex-1 bg-[#009AF4] hover:bg-[#0086D6] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Assign Leadership Role
            </Button>
          </div>
          {!canProceed() && (
            <p className="text-xs text-red-600 text-center mt-3">
              Please fill in all required fields
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
