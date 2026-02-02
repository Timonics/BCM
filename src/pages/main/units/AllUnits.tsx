import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddNewUnitModal from '@/components/modal/AddNewUnitModal';
import EditUnitModal from '@/components/modal/EditUnitModal';
import Toast from '@/components/Toast';
import {
  Search,
  Filter,
  Grid3x3,
  Users,
  UserPlus,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle,
  List,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  BellRing,
  CircleAlert,
  Clock,
  Settings,
  Award,
  Briefcase,
} from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  category: 'Ministry' | 'Administrative' | 'Support' | 'Outreach';
  membersCount: number;
  activeMembers: number;
  coordinator: string;
  description: string;
  leadershipAlerts: number;
  status: 'Active' | 'Inactive';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface UnitsListScreenProps {
  onNavigateToAddUnit?: () => void;
  onNavigateToUnitDetail?: (unitId: string) => void;
  onNavigateToEditUnit?: (unitId: string) => void;
}

export default function UnitsListScreen({
  onNavigateToAddUnit,
  onNavigateToUnitDetail,
  onNavigateToEditUnit,
}: UnitsListScreenProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    alerts: 'all',
  });
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddUnit = (unitData: any) => {
    console.log('New unit added:', unitData);
    // In a real app, this would save to the backend
    
    // Show success toast
    setToastMessage(`${unitData.name} has been created successfully!`);
    setShowToast(true);
    
    // Close modal
    setIsAddUnitModalOpen(false);
  };

  const handleEditUnit = (unitData: any) => {
    console.log('Unit updated:', unitData);
    // In a real app, this would save to the backend
    
    // Show success toast
    setToastMessage(`${unitData.name} has been updated successfully!`);
    setShowToast(true);
    
    // Close modal
    setIsEditUnitModalOpen(false);
    setSelectedUnit(null);
  };

  const handleArchiveUnit = (unitId: string) => {
    console.log('Unit archived:', unitId);
    // In a real app, this would archive in the backend
    
    // Show success toast
    setToastMessage('Unit has been archived successfully!');
    setShowToast(true);
    
    // Close modal
    setIsEditUnitModalOpen(false);
    setSelectedUnit(null);
  };

  const openEditModal = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit) {
      setSelectedUnit(unit);
      setIsEditUnitModalOpen(true);
    }
  };

  // Mock units data
  const units: Unit[] = [
    {
      id: 'teaching',
      name: 'Teaching Unit',
      category: 'Ministry',
      membersCount: 28,
      activeMembers: 26,
      coordinator: 'Brother Matthew King',
      description: 'Responsible for teaching ministries, Sunday School, and Bible study classes',
      leadershipAlerts: 2,
      status: 'Active',
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'media',
      name: 'Media Team',
      category: 'Support',
      membersCount: 15,
      activeMembers: 15,
      coordinator: 'Sister Rachel Adams',
      description: 'Handles audio/visual, live streaming, and digital content creation',
      leadershipAlerts: 0,
      status: 'Active',
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'welfare',
      name: 'Welfare Unit',
      category: 'Support',
      membersCount: 22,
      activeMembers: 20,
      coordinator: 'Sister Grace Wilson',
      description: 'Member care, hospital visits, and compassionate ministry',
      leadershipAlerts: 1,
      status: 'Active',
      trend: 'stable',
      lastUpdated: '2025-12-27',
    },
    {
      id: 'protocol',
      name: 'Protocol Unit',
      category: 'Administrative',
      membersCount: 18,
      activeMembers: 17,
      coordinator: 'Brother David Lee',
      description: 'Event planning, ushering, and church protocol management',
      leadershipAlerts: 0,
      status: 'Active',
      trend: 'stable',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'outreach',
      name: 'Outreach Unit',
      category: 'Outreach',
      membersCount: 35,
      activeMembers: 32,
      coordinator: 'Brother James Parker',
      description: 'Evangelism, community outreach, and missionary activities',
      leadershipAlerts: 1,
      status: 'Active',
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'music',
      name: 'Music Ministry',
      category: 'Ministry',
      membersCount: 42,
      activeMembers: 40,
      coordinator: 'Sister Mary Johnson',
      description: 'Choir, instrumentalists, and worship music coordination',
      leadershipAlerts: 0,
      status: 'Active',
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'finance',
      name: 'Finance Unit',
      category: 'Administrative',
      membersCount: 12,
      activeMembers: 12,
      coordinator: 'Brother Thomas Chen',
      description: 'Financial management, accounting, and treasury functions',
      leadershipAlerts: 0,
      status: 'Active',
      trend: 'stable',
      lastUpdated: '2025-12-27',
    },
    {
      id: 'youth-ministry',
      name: 'Youth Ministry',
      category: 'Ministry',
      membersCount: 25,
      activeMembers: 23,
      coordinator: 'Sister Emily Davis',
      description: 'Youth programs, mentorship, and young adult activities',
      leadershipAlerts: 3,
      status: 'Active',
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
  ];

  // Calculate summary stats
  const totalUnits = units.length;
  const totalMembers = units.reduce((sum, unit) => sum + unit.membersCount, 0);
  const totalLeadershipAlerts = units.reduce((sum, unit) => sum + unit.leadershipAlerts, 0);
  const activeUnits = units.filter(u => u.status === 'Active').length;

  // Filter units
  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         unit.coordinator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || unit.category === filters.category;
    const matchesStatus = filters.status === 'all' || unit.status === filters.status;
    const matchesAlerts = filters.alerts === 'all' ||
                         (filters.alerts === 'withAlerts' && unit.leadershipAlerts > 0) ||
                         (filters.alerts === 'noAlerts' && unit.leadershipAlerts === 0);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAlerts;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Ministry':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Administrative':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Support':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Outreach':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Ministry':
        return <Award className="w-4 h-4" />;
      case 'Administrative':
        return <Briefcase className="w-4 h-4" />;
      case 'Support':
        return <Settings className="w-4 h-4" />;
      case 'Outreach':
        return <Users className="w-4 h-4" />;
      default:
        return <Grid3x3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#222B45]">Unit Management</h2>
          <p className="text-[#8F9BB3] mt-1">Manage all church units and their operations</p>
        </div>
        <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white" onClick={() => setIsAddUnitModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Unit
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Total Units</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{totalUnits}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-[#009AF4]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Total Members</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{totalMembers}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Leadership Alerts</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{totalLeadershipAlerts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                {totalLeadershipAlerts > 0 ? (
                  <BellRing className="w-6 h-6 text-orange-600" />
                ) : (
                  <Crown className="w-6 h-6 text-orange-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Active Units</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{activeUnits}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
              <input
                type="text"
                placeholder="Search units or coordinators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-[#F7F9FC] p-1 rounded-lg">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-[#009AF4] shadow-sm'
                    : 'text-[#8F9BB3] hover:text-[#009AF4]'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-[#009AF4] shadow-sm'
                    : 'text-[#8F9BB3] hover:text-[#009AF4]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-[#EDF1F7]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(filters.category !== 'all' || filters.status !== 'all' || filters.alerts !== 'all') && (
                <Badge variant="outline" className="ml-2 bg-[#009AF4] text-white border-[#009AF4]">
                  Active
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#EDF1F7] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Ministry">Ministry</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Support">Support</option>
                  <option value="Outreach">Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">Leadership Alerts</label>
                <select
                  value={filters.alerts}
                  onChange={(e) => setFilters({ ...filters, alerts: e.target.value })}
                  className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                >
                  <option value="all">All Units</option>
                  <option value="withAlerts">With Alerts</option>
                  <option value="noAlerts">No Alerts</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                      <Grid3x3 className="w-6 h-6 text-[#009AF4]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#222B45] truncate">{unit.name}</h3>
                      <p className="text-xs text-[#8F9BB3]">{unit.coordinator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(unit.trend)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Unit Info */}
                <p className="text-sm text-[#8F9BB3] line-clamp-2">{unit.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getCategoryBadgeColor(unit.category)}>
                    {getCategoryIcon(unit.category)}
                    <span className="ml-1">{unit.category}</span>
                  </Badge>
                  <Badge variant="outline" className={
                    unit.status === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }>
                    {unit.status}
                  </Badge>
                </div>

                {/* Members Count */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8F9BB3]">Members</span>
                    <span className="font-semibold text-[#222B45]">
                      {unit.membersCount} total
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8F9BB3]">
                    <span>{unit.activeMembers} active</span>
                    <span>{unit.membersCount - unit.activeMembers} inactive</span>
                  </div>
                </div>

                {/* Leadership Alerts */}
                {unit.leadershipAlerts > 0 ? (
                  <div className="flex items-start gap-2 p-2 rounded-lg border bg-orange-50 text-orange-700 border-orange-200">
                    <BellRing className="w-4 h-4 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">
                        {unit.leadershipAlerts} leadership position{unit.leadershipAlerts > 1 ? 's' : ''} need{unit.leadershipAlerts === 1 ? 's' : ''} attention
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-lg border bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-xs font-medium">All leadership positions current</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-[#EDF1F7]">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#EDF1F7]"
                    onClick={() => onNavigateToUnitDetail?.(unit.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#EDF1F7]"
                    onClick={() => openEditModal(unit.id)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="border-[#EDF1F7] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Unit Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Coordinator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Leadership
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                          <Grid3x3 className="w-5 h-5 text-[#009AF4]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#222B45]">{unit.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {getTrendIcon(unit.trend)}
                            <span className="text-xs text-[#8F9BB3]">
                              {unit.trend === 'up' ? 'Growing' : unit.trend === 'down' ? 'Declining' : 'Stable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={getCategoryBadgeColor(unit.category)}>
                        {getCategoryIcon(unit.category)}
                        <span className="ml-1">{unit.category}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#222B45]">{unit.membersCount} total</p>
                        <p className="text-xs text-[#8F9BB3]">{unit.activeMembers} active</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">{unit.coordinator}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        unit.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }>
                        {unit.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {unit.leadershipAlerts > 0 ? (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          <BellRing className="w-3 h-3 mr-1" />
                          {unit.leadershipAlerts} alert{unit.leadershipAlerts > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigateToUnitDetail?.(unit.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(unit.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredUnits.length === 0 && (
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-[#F7F9FC] rounded-full flex items-center justify-center mb-4">
              <Grid3x3 className="w-8 h-8 text-[#8F9BB3]" />
            </div>
            <h3 className="font-semibold text-[#222B45] mb-2">No units found</h3>
            <p className="text-sm text-[#8F9BB3] mb-4">
              {searchQuery || filters.category !== 'all' || filters.status !== 'all' || filters.alerts !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first unit'}
            </p>
            {!searchQuery && filters.category === 'all' && filters.status === 'all' && filters.alerts === 'all' && (
              <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white" onClick={() => setIsAddUnitModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Unit
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Unit Modal */}
      <AddNewUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        onSave={handleAddUnit}
      />

      {/* Edit Unit Modal */}
      <EditUnitModal
        isOpen={isEditUnitModalOpen}
        onClose={() => setIsEditUnitModalOpen(false)}
        onSave={handleEditUnit}
        onArchive={handleArchiveUnit}
        unitData={selectedUnit ? {
          id: selectedUnit.id,
          name: selectedUnit.name,
          code: '',
          description: selectedUnit.description,
          isActive: selectedUnit.status === 'Active',
          defaultLeadershipRoles: ['head', 'assistant'],
          membersCount: selectedUnit.membersCount,
          activeMembers: selectedUnit.activeMembers,
        } : undefined}
      />

      {/* Toast */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type="success"
      />
    </div>
  );
}