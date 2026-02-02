import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle,
  Award,
  UserCheck,
  AlertCircle,
  Edit,
  MoreVertical,
  Eye,
  Trash2,
  UserPlus,
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
} from 'lucide-react';

interface Leader {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface Participant {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  dateOfBirth: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred';
  joinDate: string;
  attendanceRate: number;
  isReadyForGraduation: boolean;
  phone?: string;
  email?: string;
  parentName?: string;
  parentPhone?: string;
}

interface BatchLeadership {
  coordinator?: Leader;
  assistants: Leader[];
}

export default function PreYouthBatchDetail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [graduationFilter, setGraduationFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Mock batch data
  const batch = {
    id: 'p1',
    batchName: 'PY2025SET34',
    year: 2025,
    status: 'Active' as const,
    startDate: '2025-01-05',
    endDate: '2025-11-30',
    membersCount: 64,
    capacity: 80,
    description: 'Pre-Youth class for members aged 11-14, focusing on spiritual foundation and integration into youth fellowship.',
    completionRate: 35,
    attendanceRate: 85,
  };

  // Mock leadership data
  const leadership: BatchLeadership = {
    coordinator: {
      id: 'l1',
      name: 'Sister Abena Kofi',
      role: 'Class Coordinator',
      phone: '+233 24 123 4567',
      email: 'abena.kofi@bcm.org',
    },
    assistants: [
      {
        id: 'l2',
        name: 'Brother Kwame Mensah',
        role: 'Assistant Coordinator',
        phone: '+233 24 234 5678',
        email: 'kwame.mensah@bcm.org',
      },
      {
        id: 'l3',
        name: 'Sister Grace Owusu',
        role: 'Assistant Coordinator',
        phone: '+233 24 345 6789',
        email: 'grace.owusu@bcm.org',
      },
    ],
  };

  // Mock participants data
  const participants: Participant[] = [
    {
      id: 'm1',
      name: 'Kwame Asante',
      gender: 'Male',
      age: 13,
      dateOfBirth: '2012-03-15',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 92,
      isReadyForGraduation: true,
      phone: '+233 24 111 2222',
      email: 'kwame.asante@email.com',
      parentName: 'Mr. Joseph Asante',
      parentPhone: '+233 24 111 0000',
    },
    {
      id: 'm2',
      name: 'Ama Ofori',
      gender: 'Female',
      age: 12,
      dateOfBirth: '2013-07-22',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 88,
      isReadyForGraduation: true,
      phone: '+233 24 222 3333',
      parentName: 'Mrs. Elizabeth Ofori',
      parentPhone: '+233 24 222 0000',
    },
    {
      id: 'm3',
      name: 'Kofi Mensah',
      gender: 'Male',
      age: 14,
      dateOfBirth: '2011-11-08',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 75,
      isReadyForGraduation: false,
      phone: '+233 24 333 4444',
      parentName: 'Mr. David Mensah',
      parentPhone: '+233 24 333 0000',
    },
    {
      id: 'm4',
      name: 'Akosua Boateng',
      gender: 'Female',
      age: 13,
      dateOfBirth: '2012-05-19',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 95,
      isReadyForGraduation: true,
      phone: '+233 24 444 5555',
      parentName: 'Mrs. Sarah Boateng',
      parentPhone: '+233 24 444 0000',
    },
    {
      id: 'm5',
      name: 'Yaw Amoako',
      gender: 'Male',
      age: 11,
      dateOfBirth: '2014-02-14',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 68,
      isReadyForGraduation: false,
      phone: '+233 24 555 6666',
      parentName: 'Mr. Emmanuel Amoako',
      parentPhone: '+233 24 555 0000',
    },
    {
      id: 'm6',
      name: 'Abena Darko',
      gender: 'Female',
      age: 14,
      dateOfBirth: '2011-09-30',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 85,
      isReadyForGraduation: true,
      phone: '+233 24 666 7777',
      parentName: 'Mrs. Grace Darko',
      parentPhone: '+233 24 666 0000',
    },
    {
      id: 'm7',
      name: 'Kwabena Nkrumah',
      gender: 'Male',
      age: 12,
      dateOfBirth: '2013-04-12',
      status: 'Inactive',
      joinDate: '2025-01-05',
      attendanceRate: 45,
      isReadyForGraduation: false,
      phone: '+233 24 777 8888',
      parentName: 'Mr. Francis Nkrumah',
      parentPhone: '+233 24 777 0000',
    },
    {
      id: 'm8',
      name: 'Efua Appiah',
      gender: 'Female',
      age: 13,
      dateOfBirth: '2012-08-25',
      status: 'Active',
      joinDate: '2025-01-05',
      attendanceRate: 90,
      isReadyForGraduation: true,
      phone: '+233 24 888 9999',
      parentName: 'Mrs. Patricia Appiah',
      parentPhone: '+233 24 888 0000',
    },
  ];

  // Calculate statistics
  const readyForGraduation = participants.filter((p) => p.isReadyForGraduation).length;
  const activeParticipants = participants.filter((p) => p.status === 'Active').length;
  const maleCount = participants.filter((p) => p.gender === 'Male').length;
  const femaleCount = participants.filter((p) => p.gender === 'Female').length;

  // Filter participants
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;

    const matchesGraduation =
      graduationFilter === 'all' ||
      (graduationFilter === 'ready' && participant.isReadyForGraduation) ||
      (graduationFilter === 'not-ready' && !participant.isReadyForGraduation);

    return matchesSearch && matchesStatus && matchesGraduation;
  });

  const getStatusBadgeColor = (status: Participant['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Inactive':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Graduated':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Transferred':
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleMarkReady = (participantId: string) => {
    console.log('Mark ready:', participantId);
    alert('Participant marked as ready for Youth Fellowship!');
  };

  const handleBulkMarkReady = () => {
    console.log('Bulk mark ready:', selectedParticipants);
    alert(`${selectedParticipants.length} participants marked as ready for Youth Fellowship!`);
    setSelectedParticipants([]);
  };

  const handleViewParticipant = (participant: Participant) => {
    console.log('View participant:', participant);
    alert(`Navigate to ${participant.name}'s detail page.`);
  };

  const handleEditParticipant = (participant: Participant) => {
    console.log('Edit participant:', participant);
    alert(`Edit ${participant.name} modal would open here.`);
  };

  const handleRemoveParticipant = (participant: Participant) => {
    console.log('Remove participant:', participant);
    if (confirm(`Are you sure you want to remove ${participant.name} from this batch?`)) {
      alert('Participant removed successfully.');
    }
  };

  const toggleParticipantSelection = (participantId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#8F9BB3] hover:text-[#009AF4] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Class Management</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-semibold text-[#222B45]">{batch.batchName}</h1>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {batch.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#8F9BB3]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{batch.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {batch.membersCount} / {batch.capacity} Members
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[#8F9BB3] mt-2">{batch.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#EDF1F7]">
              <Edit className="w-4 h-4 mr-2" />
              Edit Batch
            </Button>
            <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Active Participants</p>
                <p className="text-3xl font-semibold text-[#222B45]">{activeParticipants}</p>
                <p className="text-xs text-[#8F9BB3] mt-1">of {participants.length} total</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Ready for Graduation</p>
                <p className="text-3xl font-semibold text-[#222B45]">{readyForGraduation}</p>
                <p className="text-xs text-purple-600 mt-1">{Math.round((readyForGraduation / participants.length) * 100)}% ready</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Gender Distribution</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#222B45]">{maleCount}M</span>
                  <span className="text-[#8F9BB3]">/</span>
                  <span className="text-2xl font-semibold text-[#222B45]">{femaleCount}F</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Avg. Attendance</p>
                <p className="text-3xl font-semibold text-[#222B45]">{batch.attendanceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">Good performance</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#009AF4]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Leadership */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader className="border-b border-[#EDF1F7]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#009AF4]" />
              Batch Leadership
            </CardTitle>
            <Button variant="outline" size="sm" className="border-[#EDF1F7]">
              <Edit className="w-4 h-4 mr-2" />
              Manage Leadership
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Coordinator */}
            {leadership.coordinator && (
              <div className="p-4 bg-gradient-to-br from-[#009AF4]/5 to-purple-50 border-2 border-[#009AF4]/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-[#009AF4]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="bg-[#009AF4]/10 text-[#009AF4] border-[#009AF4]/30 mb-2">
                      {leadership.coordinator.role}
                    </Badge>
                    <h4 className="font-semibold text-[#222B45] mb-2">{leadership.coordinator.name}</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-[#8F9BB3]">
                        <Phone className="w-3 h-3" />
                        <span>{leadership.coordinator.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8F9BB3]">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{leadership.coordinator.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assistants */}
            {leadership.assistants.map((assistant) => (
              <div key={assistant.id} className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mb-2">
                      {assistant.role}
                    </Badge>
                    <h4 className="font-semibold text-[#222B45] mb-2">{assistant.name}</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-[#8F9BB3]">
                        <Phone className="w-3 h-3" />
                        <span>{assistant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#8F9BB3]">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{assistant.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graduation Readiness Panel */}
      <Card className="border-purple-200 bg-purple-50/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-1">Graduation Readiness</h3>
                <p className="text-sm text-purple-700 mb-3">
                  {readyForGraduation} {readyForGraduation === 1 ? 'member is' : 'members are'} ready to transition to
                  Youth Fellowship
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-xs text-purple-700">Ready: {readyForGraduation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-xs text-purple-700">Not Ready: {participants.length - readyForGraduation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span className="text-xs text-purple-700">
                      Completion Rate: {Math.round((readyForGraduation / participants.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedParticipants.length > 0 && (
                <Button
                  onClick={handleBulkMarkReady}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Mark {selectedParticipants.length} Ready for Youth Fellowship
                </Button>
              )}
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                <BookOpen className="w-4 h-4 mr-2" />
                View Readiness Criteria
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader className="border-b border-[#EDF1F7]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#009AF4]" />
              Participants ({filteredParticipants.length})
            </CardTitle>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search participants..."
                  className="pl-10 pr-4 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Transferred">Transferred</option>
              </select>

              {/* Graduation Filter */}
              <select
                value={graduationFilter}
                onChange={(e) => setGraduationFilter(e.target.value)}
                className="px-4 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white"
              >
                <option value="all">All Members</option>
                <option value="ready">Ready for Graduation</option>
                <option value="not-ready">Not Ready</option>
              </select>

              <Button variant="outline" size="sm" className="border-[#EDF1F7]">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-[#EDF1F7] text-[#009AF4] focus:ring-[#009AF4]"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-[#222B45]">Member Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#222B45]">Gender</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#222B45]">Age</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#222B45]">Attendance</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#222B45]">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#222B45]">Graduation</th>
                  <th className="text-right p-4 text-sm font-semibold text-[#222B45]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={() => toggleParticipantSelection(participant.id)}
                        className="w-4 h-4 rounded border-[#EDF1F7] text-[#009AF4] focus:ring-[#009AF4]"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-[#222B45]">{participant.name}</p>
                        {participant.parentName && (
                          <p className="text-xs text-[#8F9BB3] mt-0.5">Parent: {participant.parentName}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={
                          participant.gender === 'Male'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-pink-50 text-pink-700 border-pink-200'
                        }
                      >
                        {participant.gender}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#222B45]">{participant.age} years</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-[60px]">
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                participant.attendanceRate >= 80
                                  ? 'bg-green-500'
                                  : participant.attendanceRate >= 60
                                  ? 'bg-orange-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${participant.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-[#8F9BB3] min-w-[35px]">{participant.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={getStatusBadgeColor(participant.status)}>
                        {participant.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {participant.isReadyForGraduation ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Award className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkReady(participant.id)}
                          className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs h-7"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          Mark Ready
                        </Button>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenMenuId(openMenuId === participant.id ? null : participant.id)}
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                          {openMenuId === participant.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#EDF1F7] py-1 z-20">
                                <button
                                  onClick={() => {
                                    handleViewParticipant(participant);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Profile
                                </button>
                                <button
                                  onClick={() => {
                                    handleEditParticipant(participant);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Member
                                </button>
                                <div className="border-t border-[#EDF1F7] my-1" />
                                <button
                                  onClick={() => {
                                    handleRemoveParticipant(participant);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove from Batch
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

            {filteredParticipants.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#222B45] mb-2">No Participants Found</h3>
                <p className="text-sm text-[#8F9BB3]">
                  {searchQuery || statusFilter !== 'all' || graduationFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Add participants to this batch to get started.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
