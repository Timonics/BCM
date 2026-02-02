import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditProjectModal from '@/components/modal/EditProjectModal';
import AssignCommitteeMemberModal from '@/components/modal/AssignCommitteeMemberModal';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Users,
  Edit,
  UserPlus,
  Clock,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Crown,
  Target,
  Building2,
  Heart,
  Globe,
  Music,
  GraduationCap,
  BarChart3,
  FileText,
  AlertCircle,
  UserCheck,
  UserX,
  UserMinus,
  TrendingUp,
  Archive,
  MoreVertical,
} from 'lucide-react';

interface Project {
  id: string;
  projectName: string;
  projectType: 'Evangelism' | 'Worship' | 'Education' | 'Infrastructure' | 'Welfare' | 'Youth' | 'General' | 'Program' | 'Event' | 'Construction' | 'Outreach';
  year: number;
  committeeSize: number;
  status: 'Active' | 'Completed' | 'Planned';
  startDate: string;
  endDate?: string;
  description?: string;
  progress?: number;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  position: 'Chairperson' | 'Vice Chairperson' | 'Secretary' | 'Treasurer' | 'Member';
  email: string;
  phone: string;
  band: string;
  unit: string;
  assignedDate: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Expiring Soon' | 'Expired';
  avatar?: string;
}

interface CommitteeLeader {
  id: string;
  roleId: string;
  roleName: 'Chairperson' | 'Secretary' | 'Coordinator';
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberUnit: string;
  tenureStart: string;
  tenureEnd: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  isAssigned: boolean;
}

interface ProjectHistory {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  description: string;
  type: 'member_added' | 'member_removed' | 'status_change' | 'project_updated' | 'milestone_achieved';
}

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function ProjectDetailPage({
  project,
  onBack,
  onEditProject,
  onDeleteProject,
}: ProjectDetailPageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedLeaderRole, setSelectedLeaderRole] = useState<string | null>(null);
  const [isAssignMemberModalOpen, setIsAssignMemberModalOpen] = useState(false);

  // Calculate tenure status and days remaining
  const calculateTenureStatus = (tenureEnd: string): { status: 'Active' | 'Expiring Soon' | 'Expired', daysRemaining: number } => {
    const today = new Date();
    const endDate = new Date(tenureEnd);
    const diffTime = endDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return { status: 'Expired', daysRemaining };
    } else if (daysRemaining <= 30) {
      return { status: 'Expiring Soon', daysRemaining };
    } else {
      return { status: 'Active', daysRemaining };
    }
  };

  // Mock committee leaders with different states
  const committeeLeadershipRoles: CommitteeLeader[] = [
    {
      id: 'cl1',
      roleId: 'rl1',
      roleName: 'Chairperson',
      memberName: 'Pastor David Mensah',
      memberEmail: 'david.mensah@church.org',
      memberPhone: '+233 20 123 4567',
      memberUnit: 'Accra Central',
      tenureStart: '2025-01-10',
      tenureEnd: '2025-02-10', // Expiring soon
      status: 'Expiring Soon',
      isAssigned: true,
    },
    {
      id: 'cl2',
      roleId: 'rl2',
      roleName: 'Secretary',
      memberName: 'Brother Emmanuel Asante',
      memberEmail: 'emmanuel.asante@church.org',
      memberPhone: '+233 50 345 6789',
      memberUnit: 'Kumasi',
      tenureStart: '2025-01-12',
      tenureEnd: '2026-01-12',
      status: 'Active',
      isAssigned: true,
    },
    {
      id: 'cl3',
      roleId: 'rl3',
      roleName: 'Coordinator',
      memberName: '',
      memberEmail: '',
      memberPhone: '',
      memberUnit: '',
      tenureStart: '',
      tenureEnd: '',
      status: 'Active',
      isAssigned: false, // Vacant role
    },
  ];

  const leadershipMembers: CommitteeLeader[] = [
    {
      id: 'cl1',
      roleId: 'rl1',
      roleName: 'Chairperson',
      memberName: 'Pastor David Mensah',
      memberEmail: 'david.mensah@church.org',
      memberPhone: '+233 20 123 4567',
      memberUnit: 'Accra Central',
      tenureStart: '2025-01-10',
      tenureEnd: '2026-01-10',
      status: 'Active',
      isAssigned: true,
    },
    {
      id: 'cl2',
      roleId: 'rl2',
      roleName: 'Secretary',
      memberName: 'Brother Emmanuel Asante',
      memberEmail: 'emmanuel.asante@church.org',
      memberPhone: '+233 50 345 6789',
      memberUnit: 'Kumasi',
      tenureStart: '2025-01-12',
      tenureEnd: '2026-01-12',
      status: 'Active',
      isAssigned: true,
    },
    {
      id: 'cl3',
      roleId: 'rl3',
      roleName: 'Coordinator',
      memberName: 'Sister Grace Owusu',
      memberEmail: 'grace.owusu@church.org',
      memberPhone: '+233 24 234 5678',
      memberUnit: 'Tema',
      tenureStart: '2025-01-10',
      tenureEnd: '2026-01-10',
      status: 'Active',
      isAssigned: true,
    },
  ];

  const committeeMembers: CommitteeMember[] = [
    {
      id: 'cm5',
      name: 'Brother Kwame Boateng',
      role: 'Logistics Coordinator',
      position: 'Member',
      email: 'kwame.boateng@church.org',
      phone: '+233 20 567 8901',
      band: 'Band A',
      unit: 'Takoradi',
      assignedDate: '2025-01-15',
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      status: 'Active',
    },
    {
      id: 'cm6',
      name: 'Sister Ama Ofori',
      role: 'Outreach Coordinator',
      position: 'Member',
      email: 'ama.ofori@church.org',
      phone: '+233 24 678 9012',
      band: 'Band B',
      unit: 'Cape Coast',
      assignedDate: '2025-01-15',
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      status: 'Active',
    },
    {
      id: 'cm7',
      name: 'Brother Kofi Appiah',
      role: 'Media & Communications',
      position: 'Member',
      email: 'kofi.appiah@church.org',
      phone: '+233 50 789 0123',
      band: 'Band C',
      unit: 'Accra Central',
      assignedDate: '2025-01-18',
      startDate: '2025-01-18',
      endDate: '2025-12-31',
      status: 'Active',
    },
    {
      id: 'cm8',
      name: 'Sister Efua Mensah',
      role: 'Volunteer Coordinator',
      position: 'Member',
      email: 'efua.mensah@church.org',
      phone: '+233 27 890 1234',
      band: 'Band D',
      unit: 'Tema',
      assignedDate: '2025-01-18',
      startDate: '2025-01-18',
      endDate: '2025-12-31',
      status: 'Active',
    },
    {
      id: 'cm9',
      name: 'Brother Yaw Adomako',
      role: 'Technical Support',
      position: 'Member',
      email: 'yaw.adomako@church.org',
      phone: '+233 20 901 2345',
      band: 'Band E',
      unit: 'Kumasi',
      assignedDate: '2025-01-20',
      startDate: '2025-01-20',
      endDate: '2025-12-31',
      status: 'Active',
    },
    {
      id: 'cm10',
      name: 'Sister Adjoa Nyarko',
      role: 'Prayer Team Lead',
      position: 'Member',
      email: 'adjoa.nyarko@church.org',
      phone: '+233 24 012 3456',
      band: 'Band F',
      unit: 'Accra Central',
      assignedDate: '2025-01-20',
      startDate: '2025-01-20',
      endDate: '2025-12-31',
      status: 'Active',
    },
  ];

  // Mock project history
  const projectHistory: ProjectHistory[] = [
    {
      id: 'ph1',
      date: '2025-01-20',
      action: 'Member Added',
      performedBy: 'Admin User',
      description: 'Added Sister Adjoa Nyarko as Prayer Team Lead',
      type: 'member_added',
    },
    {
      id: 'ph2',
      date: '2025-01-20',
      action: 'Member Added',
      performedBy: 'Admin User',
      description: 'Added Brother Yaw Adomako as Technical Support',
      type: 'member_added',
    },
    {
      id: 'ph3',
      date: '2025-01-18',
      action: 'Milestone Achieved',
      performedBy: 'Pastor David Mensah',
      description: 'Completed venue booking for all campaign events',
      type: 'milestone_achieved',
    },
    {
      id: 'ph4',
      date: '2025-01-18',
      action: 'Member Added',
      performedBy: 'Admin User',
      description: 'Added Sister Efua Mensah as Volunteer Coordinator',
      type: 'member_added',
    },
    {
      id: 'ph5',
      date: '2025-01-18',
      action: 'Member Added',
      performedBy: 'Admin User',
      description: 'Added Brother Kofi Appiah as Media & Communications',
      type: 'member_added',
    },
    {
      id: 'ph6',
      date: '2025-01-15',
      action: 'Project Updated',
      performedBy: 'Pastor David Mensah',
      description: 'Updated project description and timeline details',
      type: 'project_updated',
    },
    {
      id: 'ph7',
      date: '2025-01-12',
      action: 'Member Added',
      performedBy: 'Admin User',
      description: 'Added Sister Abena Kofi as Treasurer',
      type: 'member_added',
    },
    {
      id: 'ph8',
      date: '2025-01-12',
      action: 'Member Added',
      performedBy: 'Admin User',
      description: 'Added Brother Emmanuel Asante as Secretary',
      type: 'member_added',
    },
    {
      id: 'ph9',
      date: '2025-01-10',
      action: 'Status Change',
      performedBy: 'Admin User',
      description: 'Project status changed to Active',
      type: 'status_change',
    },
    {
      id: 'ph10',
      date: '2025-01-10',
      action: 'Project Created',
      performedBy: 'Admin User',
      description: 'Project created with initial committee leadership',
      type: 'project_updated',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Evangelism':
        return <Globe className="w-5 h-5" />;
      case 'Worship':
        return <Music className="w-5 h-5" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5" />;
      case 'Infrastructure':
        return <Building2 className="w-5 h-5" />;
      case 'Welfare':
        return <Heart className="w-5 h-5" />;
      case 'Youth':
        return <Users className="w-5 h-5" />;
      case 'Program':
        return <Target className="w-5 h-5" />;
      case 'Event':
        return <Calendar className="w-5 h-5" />;
      case 'Construction':
        return <Building2 className="w-5 h-5" />;
      case 'Outreach':
        return <Heart className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'Planned':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Planned
          </Badge>
        );
      case 'Completed':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Archive className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPositionBadgeColor = (position: string) => {
    switch (position) {
      case 'Chairperson':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Vice Chairperson':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Secretary':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Treasurer':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'member_added':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'member_removed':
        return <UserX className="w-4 h-4 text-red-600" />;
      case 'status_change':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'project_updated':
        return <Edit className="w-4 h-4 text-orange-600" />;
      case 'milestone_achieved':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateDaysRemaining = () => {
    if (!project.endDate) return null;
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="hover:bg-[#F7F9FC] text-[#8F9BB3] hover:text-[#009AF4]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Button>

      {/* Header Section */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: Project Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                  {getProjectTypeIcon(project.projectType)}
                  <span className="sr-only">{project.projectType}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <h1 className="text-2xl font-semibold text-[#222B45]">{project.projectName}</h1>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#8F9BB3]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium text-[#222B45]">{project.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>{project.projectType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.committeeSize} Committee Members</span>
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-[#8F9BB3] mt-3 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Project Timeline */}
              <div className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[#009AF4]" />
                  <p className="text-sm font-medium text-[#222B45]">Project Timeline</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-[#8F9BB3] mb-1">Start Date</p>
                    <p className="text-sm font-medium text-[#222B45]">{formatDate(project.startDate)}</p>
                  </div>
                  {project.endDate && (
                    <>
                      <div>
                        <p className="text-xs text-[#8F9BB3] mb-1">End Date</p>
                        <p className="text-sm font-medium text-[#222B45]">{formatDate(project.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8F9BB3] mb-1">Time Remaining</p>
                        {daysRemaining !== null && (
                          <p className={`text-sm font-medium ${
                            daysRemaining < 0 
                              ? 'text-red-600' 
                              : daysRemaining <= 30 
                              ? 'text-orange-600' 
                              : 'text-green-600'
                          }`}>
                            {daysRemaining < 0 
                              ? `${Math.abs(daysRemaining)} days overdue` 
                              : `${daysRemaining} days`}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {project.progress !== undefined && project.status === 'Active' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#8F9BB3]">Progress</p>
                      <p className="text-sm font-medium text-[#222B45]">{project.progress}%</p>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#009AF4] transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex lg:flex-col gap-3">
              <Button onClick={() => setIsAssignMemberModalOpen(true)} className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Members
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Committee Leadership Section */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#009AF4]" />
            Committee Leadership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {committeeLeadershipRoles.map((leader) => {
              const tenureInfo = leader.isAssigned ? calculateTenureStatus(leader.tenureEnd) : null;
              
              return (
                <div
                  key={leader.roleId}
                  className={`p-5 border-2 rounded-lg transition-all ${
                    !leader.isAssigned
                      ? 'border-dashed border-[#EDF1F7] bg-[#F7F9FC]'
                      : tenureInfo?.status === 'Expiring Soon'
                      ? 'border-amber-200 bg-amber-50/30'
                      : tenureInfo?.status === 'Expired'
                      ? 'border-red-200 bg-red-50/30'
                      : 'border-[#EDF1F7] hover:border-[#009AF4] hover:shadow-sm'
                  }`}
                >
                  {/* Role Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Crown className={`w-5 h-5 ${
                        leader.roleName === 'Chairperson' ? 'text-purple-600' :
                        leader.roleName === 'Secretary' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                      <h4 className="font-semibold text-[#222B45]">{leader.roleName}</h4>
                    </div>
                    
                    {leader.isAssigned && tenureInfo && (
                      <Badge 
                        variant="outline" 
                        className={
                          tenureInfo.status === 'Expiring Soon'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : tenureInfo.status === 'Expired'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }
                      >
                        {tenureInfo.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {tenureInfo.status === 'Expiring Soon' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {tenureInfo.status === 'Expired' && <Clock className="w-3 h-3 mr-1" />}
                        {tenureInfo.status}
                      </Badge>
                    )}
                    
                    {!leader.isAssigned && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Vacant
                      </Badge>
                    )}
                  </div>

                  {/* Assigned Member or Empty State */}
                  {leader.isAssigned ? (
                    <>
                      {/* Member Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#009AF4] font-semibold text-sm">
                              {leader.memberName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#222B45] truncate">{leader.memberName}</p>
                            <p className="text-xs text-[#8F9BB3] truncate">{leader.memberUnit}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#8F9BB3]">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{leader.memberEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{leader.memberPhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tenure Information */}
                      <div className="p-3 bg-white border border-[#EDF1F7] rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-3 h-3 text-[#009AF4]" />
                          <p className="text-xs font-medium text-[#222B45]">Tenure Period</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div>
                            <p className="text-[#8F9BB3]">Start</p>
                            <p className="font-medium text-[#222B45]">{formatDate(leader.tenureStart)}</p>
                          </div>
                          <div>
                            <p className="text-[#8F9BB3]">End</p>
                            <p className="font-medium text-[#222B45]">{formatDate(leader.tenureEnd)}</p>
                          </div>
                        </div>
                        
                        {/* Expiry Warning */}
                        {tenureInfo && tenureInfo.status !== 'Active' && (
                          <div className={`mt-2 p-2 rounded text-xs flex items-start gap-2 ${
                            tenureInfo.status === 'Expiring Soon'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>
                              {tenureInfo.status === 'Expiring Soon'
                                ? `Expires in ${tenureInfo.daysRemaining} days`
                                : `Expired ${Math.abs(tenureInfo.daysRemaining)} days ago`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
                          onClick={() => setSelectedLeaderRole(leader.roleId)}
                        >
                          <UserX className="w-3 h-3 mr-2" />
                          Replace Leader
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          onClick={() => setSelectedLeaderRole(leader.roleId)}
                        >
                          <UserMinus className="w-3 h-3 mr-2" />
                          End Leadership
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* Empty State for Vacant Role */
                    <>
                      <div className="flex flex-col items-center justify-center py-6 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                          <UserPlus className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 text-center mb-1">No leader assigned</p>
                        <p className="text-xs text-gray-500 text-center">This role is currently vacant</p>
                      </div>

                      {/* Assign Action */}
                      <Button
                        size="sm"
                        className="w-full bg-[#009AF4] hover:bg-[#0086D6] text-white"
                        onClick={() => setSelectedLeaderRole(leader.roleId)}
                      >
                        <UserPlus className="w-3 h-3 mr-2" />
                        Assign Leader
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leadership Summary */}
          <div className="mt-6 pt-4 border-t border-[#EDF1F7] flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">
                    {committeeLeadershipRoles.filter(l => l.isAssigned && calculateTenureStatus(l.tenureEnd).status === 'Active').length}
                  </span> Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">
                    {committeeLeadershipRoles.filter(l => l.isAssigned && calculateTenureStatus(l.tenureEnd).status === 'Expiring Soon').length}
                  </span> Expiring
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-gray-600" />
                <span className="text-[#8F9BB3]">
                  <span className="font-medium text-[#222B45]">
                    {committeeLeadershipRoles.filter(l => !l.isAssigned).length}
                  </span> Vacant
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Committee Members Section */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#009AF4]" />
              Committee Members
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setIsAssignMemberModalOpen(true)}
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Member Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Band
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {committeeMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#F7F9FC] transition-colors">
                    {/* Member Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#009AF4] text-sm font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#222B45] truncate">{member.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-[#8F9BB3] mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {member.role}
                      </Badge>
                    </td>

                    {/* Band */}
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <Music className="w-3 h-3 mr-1" />
                        {member.band}
                      </Badge>
                    </td>

                    {/* Unit */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#8F9BB3]" />
                        <span className="text-sm text-[#222B45]">{member.unit}</span>
                      </div>
                    </td>

                    {/* Start Date */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#222B45]">
                        <Calendar className="w-3.5 h-3.5 text-[#8F9BB3]" />
                        {formatDate(member.startDate)}
                      </div>
                    </td>

                    {/* End Date */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#222B45]">
                        <Calendar className="w-3.5 h-3.5 text-[#8F9BB3]" />
                        {formatDate(member.endDate)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <Badge 
                        variant="outline" 
                        className={
                          member.status === 'Active' 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : member.status === 'Expiring Soon'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : member.status === 'Expired'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {member.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {member.status === 'Expiring Soon' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {member.status === 'Expired' && <Clock className="w-3 h-3 mr-1" />}
                        {member.status === 'Inactive' && <UserX className="w-3 h-3 mr-1" />}
                        {member.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}
                            className="hover:bg-[#009AF4]/10 hover:text-[#009AF4]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {/* Dropdown Menu */}
                          {selectedMemberId === member.id && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setSelectedMemberId(null)}
                              />
                              
                              {/* Menu */}
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#EDF1F7] py-2 z-20">
                                <button
                                  className="w-full px-4 py-2.5 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-3 transition-colors"
                                  onClick={() => {
                                    console.log('View profile:', member.id);
                                    setSelectedMemberId(null);
                                  }}
                                >
                                  <Users className="w-4 h-4 text-[#009AF4]" />
                                  <div>
                                    <p className="font-medium">View Member Profile</p>
                                    <p className="text-xs text-[#8F9BB3]">See full details</p>
                                  </div>
                                </button>

                                <div className="h-px bg-[#EDF1F7] my-1" />

                                <button
                                  className="w-full px-4 py-2.5 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-3 transition-colors"
                                  onClick={() => {
                                    console.log('Edit role:', member.id);
                                    setSelectedMemberId(null);
                                  }}
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <p className="font-medium">Edit Role</p>
                                    <p className="text-xs text-[#8F9BB3]">Change responsibilities</p>
                                  </div>
                                </button>

                                <div className="h-px bg-[#EDF1F7] my-1" />

                                <button
                                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                  onClick={() => {
                                    console.log('End membership:', member.id);
                                    setSelectedMemberId(null);
                                  }}
                                >
                                  <UserMinus className="w-4 h-4" />
                                  <div>
                                    <p className="font-medium">End Membership</p>
                                    <p className="text-xs text-red-400">Remove from committee</p>
                                  </div>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Member Summary */}
          <div className="mt-6 pt-4 border-t border-[#EDF1F7]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-[#8F9BB3]">
                Showing <span className="font-medium text-[#222B45]">{committeeMembers.length}</span> committee members
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-[#8F9BB3]">
                    <span className="font-medium text-[#222B45]">
                      {committeeMembers.filter(m => m.status === 'Active').length}
                    </span> Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-[#8F9BB3]">
                    <span className="font-medium text-[#222B45]">
                      {committeeMembers.filter(m => m.status === 'Expiring Soon').length}
                    </span> Expiring Soon
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-gray-600" />
                  <span className="text-[#8F9BB3]">
                    <span className="font-medium text-[#222B45]">
                      {committeeMembers.filter(m => m.status === 'Inactive').length}
                    </span> Inactive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project History Section */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#009AF4]" />
            Project History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectHistory.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#F7F9FC] border-2 border-[#EDF1F7] flex items-center justify-center flex-shrink-0">
                    {getHistoryIcon(item.type)}
                  </div>
                  {index < projectHistory.length - 1 && (
                    <div className="w-0.5 h-full min-h-[40px] bg-[#EDF1F7] my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-medium text-[#222B45]">{item.action}</h4>
                      <p className="text-xs text-[#8F9BB3] mt-0.5">
                        By {item.performedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8F9BB3]">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.date)}
                    </div>
                  </div>
                  <p className="text-sm text-[#8F9BB3]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]">
              <FileText className="w-4 h-4 mr-2" />
              View Complete History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updatedProject) => {
          onEditProject(updatedProject);
          setIsEditModalOpen(false);
        }}
        onDelete={onDeleteProject}
        project={project}
      />

      {/* Assign Committee Member Modal */}
      <AssignCommitteeMemberModal
        isOpen={isAssignMemberModalOpen}
        onClose={() => setIsAssignMemberModalOpen(false)}
        onAssign={(assignment) => {
          console.log('Committee member assigned:', assignment);
          // Handle assignment logic here
        }}
        projectName={project.projectName}
        existingCommitteeMembers={[...committeeLeadershipRoles.filter(l => l.isAssigned).map(l => ({
          id: l.id,
          name: l.memberName,
          role: l.roleName,
        })), ...committeeMembers.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
        }))]}
      />
    </div>
  );
}