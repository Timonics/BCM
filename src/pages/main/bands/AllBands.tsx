import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddNewBandModal from '@/components/modal/AddNewBandModal';
import EditBandModal from '@/components/modal/EditBandModal';
import Toast from '@/components/Toast';
import {
  Search,
  Filter,
  Music,
  Users,
  UserPlus,
  Eye,
  Pencil,
  AlertTriangle,
  CheckCircle,
  Grid3x3,
  List,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Info,
} from 'lucide-react';

interface Band {
  id: string;
  name: string;
  genderType: 'Male' | 'Female' | 'Mixed';
  minAge: number;
  maxAge: number;
  membersCount: number;
  activeMembers: number;
  capacity: number;
  coordinator: string;
  alerts: {
    type: 'overgrown' | 'capacity' | 'underutilized' | 'inactive';
    count: number;
    message: string;
  }[];
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export default function AllBands() {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genderType: 'all',
    alertStatus: 'all',
  });
  const [isAddBandModalOpen, setIsAddBandModalOpen] = useState(false);
  const [isEditBandModalOpen, setIsEditBandModalOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddBand = (bandData: any) => {
    console.log('New band added:', bandData);
    // In a real app, this would save to the backend
    
    // Show success toast
    setToastMessage(`${bandData.name} has been created successfully!`);
    setShowToast(true);
    
    // Close modal
    setIsAddBandModalOpen(false);
  };

  const handleEditBand = (bandData: any) => {
    console.log('Band updated:', bandData);
    // In a real app, this would save to the backend
    
    // Show success toast
    setToastMessage(`${bandData.name} has been updated successfully!`);
    setShowToast(true);
    
    // Close modal
    setIsEditBandModalOpen(false);
    setSelectedBand(null);
  };

  const handleArchiveBand = (bandId: string) => {
    console.log('Band archived:', bandId);
    // In a real app, this would archive in the backend
    
    // Show success toast
    setToastMessage('Band has been archived successfully!');
    setShowToast(true);
    
    // Close modal
    setIsEditBandModalOpen(false);
    setSelectedBand(null);
  };

  const openEditModal = (bandId: string) => {
    const band = bands.find(b => b.id === bandId);
    if (band) {
      setSelectedBand(band);
      setIsEditBandModalOpen(true);
    }
  };

  // Mock bands data
  const bands: Band[] = [
    {
      id: 'children',
      name: "Children's Band",
      genderType: 'Mixed',
      minAge: 5,
      maxAge: 12,
      membersCount: 45,
      activeMembers: 42,
      capacity: 60,
      coordinator: 'Sister Grace',
      alerts: [],
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'youth',
      name: 'Youth Band',
      genderType: 'Mixed',
      minAge: 13,
      maxAge: 25,
      membersCount: 68,
      activeMembers: 65,
      capacity: 80,
      coordinator: 'Brother John',
      alerts: [
        {
          type: 'overgrown',
          count: 12,
          message: '12 members exceed age bracket',
        },
      ],
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'choir',
      name: 'Choir Band',
      genderType: 'Mixed',
      minAge: 18,
      maxAge: 100,
      membersCount: 32,
      activeMembers: 28,
      capacity: 50,
      coordinator: 'Sister Mary',
      alerts: [
        {
          type: 'underutilized',
          count: 0,
          message: 'Band is under capacity',
        },
      ],
      trend: 'down',
      lastUpdated: '2025-12-27',
    },
    {
      id: 'men',
      name: "Men's Band",
      genderType: 'Male',
      minAge: 26,
      maxAge: 100,
      membersCount: 54,
      activeMembers: 51,
      capacity: 70,
      coordinator: 'Brother David',
      alerts: [],
      trend: 'up',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'women',
      name: "Women's Band",
      genderType: 'Female',
      minAge: 26,
      maxAge: 100,
      membersCount: 48,
      activeMembers: 45,
      capacity: 70,
      coordinator: 'Sister Rebecca',
      alerts: [],
      trend: 'stable',
      lastUpdated: '2025-12-28',
    },
    {
      id: 'overgrown',
      name: 'Overgrown Band',
      genderType: 'Mixed',
      minAge: 26,
      maxAge: 100,
      membersCount: 15,
      activeMembers: 12,
      capacity: 30,
      coordinator: 'Brother Paul',
      alerts: [
        {
          type: 'inactive',
          count: 3,
          message: '3 inactive members',
        },
      ],
      trend: 'stable',
      lastUpdated: '2025-12-25',
    },
  ];

  // Calculate summary stats
  const totalBands = bands.length;
  const totalMembers = bands.reduce((sum, band) => sum + band.membersCount, 0);
  const totalAlerts = bands.reduce((sum, band) => sum + band.alerts.length, 0);
  const averageOccupancy = Math.round(
    (bands.reduce((sum, band) => sum + (band.membersCount / band.capacity) * 100, 0) / bands.length)
  );

  // Filter bands
  const filteredBands = bands.filter(band => {
    const matchesSearch = band.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         band.coordinator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = filters.genderType === 'all' || band.genderType === filters.genderType;
    const matchesAlerts = filters.alertStatus === 'all' ||
                         (filters.alertStatus === 'withAlerts' && band.alerts.length > 0) ||
                         (filters.alertStatus === 'noAlerts' && band.alerts.length === 0);
    
    return matchesSearch && matchesGender && matchesAlerts;
  });

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'overgrown':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'capacity':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'underutilized':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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

  const getGenderBadgeColor = (gender: string) => {
    switch (gender) {
      case 'Male':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Female':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#222B45]">Band Management</h2>
          <p className="text-[#8F9BB3] mt-1">Manage all church bands and their members</p>
        </div>
        <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white" onClick={() => setIsAddBandModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Band
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Total Bands</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{totalBands}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Music className="w-6 h-6 text-[#009AF4]" />
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
                <p className="text-xs text-[#8F9BB3]">Active Alerts</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{totalAlerts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Avg. Occupancy</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">{averageOccupancy}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
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
                placeholder="Search bands or coordinators..."
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
              {(filters.genderType !== 'all' || filters.alertStatus !== 'all') && (
                <Badge variant="outline" className="ml-2 bg-[#009AF4] text-white border-[#009AF4]">
                  Active
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#EDF1F7] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">Gender Type</label>
                <select
                  value={filters.genderType}
                  onChange={(e) => setFilters({ ...filters, genderType: e.target.value })}
                  className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                >
                  <option value="all">All Gender Types</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#222B45] mb-2">Alert Status</label>
                <select
                  value={filters.alertStatus}
                  onChange={(e) => setFilters({ ...filters, alertStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                >
                  <option value="all">All Bands</option>
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
          {filteredBands.map((band) => (
            <Card key={band.id} className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-[#009AF4]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#222B45] truncate">{band.name}</h3>
                      <p className="text-xs text-[#8F9BB3]">{band.coordinator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(band.trend)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Band Info */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getGenderBadgeColor(band.genderType)}>
                    {band.genderType}
                  </Badge>
                  <Badge variant="outline" className="bg-[#F7F9FC] text-[#222B45] border-[#EDF1F7]">
                    {band.minAge}-{band.maxAge === 100 ? '∞' : band.maxAge} years
                  </Badge>
                </div>

                {/* Members Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8F9BB3]">Members</span>
                    <span className="font-semibold text-[#222B45]">
                      {band.membersCount} / {band.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-[#EDF1F7] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (band.membersCount / band.capacity) * 100 > 90
                          ? 'bg-red-500'
                          : (band.membersCount / band.capacity) * 100 > 70
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(band.membersCount / band.capacity) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8F9BB3]">
                    <span>{band.activeMembers} active</span>
                    <span>{Math.round((band.membersCount / band.capacity) * 100)}% capacity</span>
                  </div>
                </div>

                {/* Alerts */}
                {band.alerts.length > 0 ? (
                  <div className="space-y-2">
                    {band.alerts.map((alert, idx) => (
                      <div key={idx} className={`flex items-start gap-2 p-2 rounded-lg border ${getAlertColor(alert.type)}`}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 rounded-lg border bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-xs font-medium">All systems normal</p>
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center gap-1 text-xs text-[#8F9BB3] pt-2 border-t border-[#EDF1F7]">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {new Date(band.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#EDF1F7]"
                    // onClick={() => onNavigateToBandDetails?.(band.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#EDF1F7]"
                    onClick={() => openEditModal(band.id)}
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
                    Band Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Gender Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Age Bracket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Coordinator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredBands.map((band) => (
                  <tr key={band.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-[#009AF4]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#222B45]">{band.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {getTrendIcon(band.trend)}
                            <span className="text-xs text-[#8F9BB3]">
                              {band.trend === 'up' ? 'Growing' : band.trend === 'down' ? 'Declining' : 'Stable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={getGenderBadgeColor(band.genderType)}>
                        {band.genderType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">
                        {band.minAge}-{band.maxAge === 100 ? '∞' : band.maxAge} years
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#222B45]">
                            {band.membersCount} / {band.capacity}
                          </span>
                          <span className="text-xs text-[#8F9BB3]">
                            ({Math.round((band.membersCount / band.capacity) * 100)}%)
                          </span>
                        </div>
                        <div className="w-24 bg-[#EDF1F7] rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              (band.membersCount / band.capacity) * 100 > 90
                                ? 'bg-red-500'
                                : (band.membersCount / band.capacity) * 100 > 70
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(band.membersCount / band.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">{band.coordinator}</span>
                    </td>
                    <td className="px-6 py-4">
                      {band.alerts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {band.alerts.map((alert, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={getAlertColor(alert.type)}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {alert.count > 0 ? alert.count : alert.type}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Normal
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                        //   onClick={() => onNavigateToBandDetails?.(band.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(band.id)}
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
      {filteredBands.length === 0 && (
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-[#F7F9FC] rounded-full flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-[#8F9BB3]" />
            </div>
            <h3 className="font-semibold text-[#222B45] mb-2">No bands found</h3>
            <p className="text-sm text-[#8F9BB3] mb-4">
              {searchQuery || filters.genderType !== 'all' || filters.alertStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first band'}
            </p>
            {!searchQuery && filters.genderType === 'all' && filters.alertStatus === 'all' && (
              <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white" onClick={() => setIsAddBandModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Band
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add New Band Modal */}
      <AddNewBandModal
        isOpen={isAddBandModalOpen}
        onClose={() => setIsAddBandModalOpen(false)}
        onSave={handleAddBand}
      />

      {/* Edit Band Modal */}
      <EditBandModal
        isOpen={isEditBandModalOpen}
        onClose={() => setIsEditBandModalOpen(false)}
        onSave={handleEditBand}
        onArchive={handleArchiveBand}
        bandData={selectedBand ? {
          id: selectedBand.id,
          name: selectedBand.name,
          code: '',
          type: selectedBand.genderType,
          hasAgeBracket: true,
          minAge: selectedBand.minAge,
          maxAge: selectedBand.maxAge,
          description: '',
          isActive: true,
          membersCount: selectedBand.membersCount,
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