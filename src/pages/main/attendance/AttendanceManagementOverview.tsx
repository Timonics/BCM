import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateAttendanceModal } from '@/components/modal/CreateAttendanceModal';
import {
  ClipboardCheck,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CalendarDays,
  FileText,
  BarChart3,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  eventType: string;
  eventName: string;
  location: string;
  totalAttendance: number;
  adults: number;
  youth: number;
  children: number;
  firstTimers: number;
  notes?: string;
  recordedBy: string;
  status: 'Verified' | 'Pending' | 'Draft';
}

interface AttendanceManagementOverviewProps {
  onNavigateToDetail?: () => void;
  onNavigateToEntry?: () => void;
}

export default function AttendanceManagementOverview({
  onNavigateToDetail,
}: AttendanceManagementOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock attendance records
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 'att1',
      date: '2026-01-01',
      eventType: 'Sunday Service',
      eventName: 'New Year Service',
      location: 'Main Auditorium',
      totalAttendance: 1245,
      adults: 682,
      youth: 358,
      children: 205,
      firstTimers: 28,
      notes: 'Special New Year service with baptism',
      recordedBy: 'Pastor John Doe',
      status: 'Verified',
    },
    {
      id: 'att2',
      date: '2025-12-29',
      eventType: 'Sunday Service',
      eventName: 'Regular Sunday Service',
      location: 'Main Auditorium',
      totalAttendance: 892,
      adults: 520,
      youth: 245,
      children: 127,
      firstTimers: 12,
      recordedBy: 'Elder Grace Owusu',
      status: 'Verified',
    },
    {
      id: 'att3',
      date: '2025-12-25',
      eventType: 'Special Service',
      eventName: 'Christmas Day Service',
      location: 'Main Auditorium',
      totalAttendance: 1580,
      adults: 890,
      youth: 425,
      children: 265,
      firstTimers: 45,
      notes: 'Christmas celebration with special programs',
      recordedBy: 'Pastor John Doe',
      status: 'Verified',
    },
    {
      id: 'att4',
      date: '2025-12-24',
      eventType: 'Wednesday Service',
      eventName: 'Bible Study',
      location: 'Main Auditorium',
      totalAttendance: 456,
      adults: 320,
      youth: 98,
      children: 38,
      firstTimers: 5,
      recordedBy: 'Deacon Sarah Brown',
      status: 'Verified',
    },
    {
      id: 'att5',
      date: '2025-12-22',
      eventType: 'Sunday Service',
      eventName: 'Regular Sunday Service',
      location: 'Main Auditorium',
      totalAttendance: 978,
      adults: 578,
      youth: 268,
      children: 132,
      firstTimers: 18,
      recordedBy: 'Elder Grace Owusu',
      status: 'Verified',
    },
    {
      id: 'att6',
      date: '2025-12-20',
      eventType: 'Youth Meeting',
      eventName: 'Youth Night',
      location: 'Youth Hall',
      totalAttendance: 245,
      adults: 45,
      youth: 180,
      children: 20,
      firstTimers: 8,
      notes: 'Year-end youth gathering',
      recordedBy: 'Youth Pastor David Chen',
      status: 'Verified',
    },
    {
      id: 'att7',
      date: '2025-12-18',
      eventType: 'Prayer Meeting',
      eventName: 'Morning Prayer',
      location: 'Prayer Room',
      totalAttendance: 125,
      adults: 98,
      youth: 22,
      children: 5,
      firstTimers: 2,
      recordedBy: 'Elder Michael Wilson',
      status: 'Verified',
    },
    {
      id: 'att8',
      date: '2025-12-15',
      eventType: 'Sunday Service',
      eventName: 'Regular Sunday Service',
      location: 'Main Auditorium',
      totalAttendance: 945,
      adults: 556,
      youth: 258,
      children: 131,
      firstTimers: 15,
      recordedBy: 'Elder Grace Owusu',
      status: 'Verified',
    },
    {
      id: 'att9',
      date: '2025-12-13',
      eventType: 'Special Service',
      eventName: 'Leadership Conference',
      location: 'Conference Hall',
      totalAttendance: 180,
      adults: 165,
      youth: 15,
      children: 0,
      firstTimers: 0,
      notes: 'Annual leadership training',
      recordedBy: 'Pastor John Doe',
      status: 'Verified',
    },
    {
      id: 'att10',
      date: '2025-12-11',
      eventType: 'Wednesday Service',
      eventName: 'Bible Study',
      location: 'Main Auditorium',
      totalAttendance: 432,
      adults: 305,
      youth: 92,
      children: 35,
      firstTimers: 6,
      recordedBy: 'Deacon Sarah Brown',
      status: 'Verified',
    },
  ];

  // Filter records
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || record.eventType === categoryFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = record.date === today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(record.date) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(record.date) >= monthAgo;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Calculate statistics
  const totalRecords = attendanceRecords.length;
  const monthAttendance = attendanceRecords
    .filter((r) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return new Date(r.date) >= monthAgo;
    })
    .reduce((sum, r) => sum + r.totalAttendance, 0);

  const sortedByAttendance = [...attendanceRecords].sort(
    (a, b) => b.totalAttendance - a.totalAttendance
  );
  const highestAttendance = sortedByAttendance[0];
  const lowestAttendance = sortedByAttendance[sortedByAttendance.length - 1];

  // Calculate trends
  const thisWeek = attendanceRecords
    .filter((r) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.date) >= weekAgo;
    })
    .reduce((sum, r) => sum + r.totalAttendance, 0);

  const lastWeek = attendanceRecords
    .filter((r) => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.date) >= twoWeeksAgo && new Date(r.date) < weekAgo;
    })
    .reduce((sum, r) => sum + r.totalAttendance, 0);

  const weekTrend = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Draft':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCreateAttendance = () => {
    console.log('Create attendance');
    setShowCreateModal(true);
  };

  const handleViewRecord = (record: AttendanceRecord) => {
    console.log('View record:', record);
    if (onNavigateToDetail) {
      onNavigateToDetail();
    } else {
      alert(`View detailed attendance record for ${record.eventName}`);
    }
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    console.log('Edit record:', record);
    alert(`Edit attendance record for ${record.eventName}`);
  };

  const handleDeleteRecord = (record: AttendanceRecord) => {
    console.log('Delete record:', record);
    if (confirm(`Are you sure you want to delete the attendance record for ${record.eventName}?`)) {
      alert('Record deleted');
    }
  };

  const handleExport = () => {
    console.log('Export attendance records');
    alert('Export attendance records to CSV/PDF');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#222B45]">Attendance Management</h1>
              <p className="text-[#8F9BB3] mt-1">Service and activity participation records</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreateAttendance}
          className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Record Attendance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Records */}
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Total Attendance Records</p>
                <p className="text-3xl font-semibold text-[#222B45]">{totalRecords}</p>
                <p className="text-xs text-[#8F9BB3] mt-2">All recorded events</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Attendance This Month</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {monthAttendance.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {weekTrend >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">+{Math.abs(weekTrend).toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-red-600">-{Math.abs(weekTrend).toFixed(1)}%</span>
                    </>
                  )}
                  <span className="text-xs text-[#8F9BB3] ml-1">vs last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highest Attendance */}
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Highest Attendance Day</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {highestAttendance.totalAttendance.toLocaleString()}
                </p>
                <p className="text-xs text-[#8F9BB3] mt-2">
                  {highestAttendance.eventName} • {formatDate(highestAttendance.date).split(',')[0]}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lowest Attendance */}
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Lowest Attendance Day</p>
                <p className="text-3xl font-semibold text-[#222B45]">
                  {lowestAttendance.totalAttendance.toLocaleString()}
                </p>
                <p className="text-xs text-[#8F9BB3] mt-2">
                  {lowestAttendance.eventName} • {formatDate(lowestAttendance.date).split(',')[0]}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event name, type, or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4]"
              />
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8F9BB3]" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white min-w-37.5"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8F9BB3]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] bg-white min-w-45"
              >
                <option value="all">All Categories</option>
                <option value="Sunday Service">Sunday Service</option>
                <option value="Wednesday Service">Wednesday Service</option>
                <option value="Youth Meeting">Youth Meeting</option>
                <option value="Prayer Meeting">Prayer Meeting</option>
                <option value="Special Service">Special Service</option>
              </select>
            </div>

            {/* Export Button */}
            <Button onClick={handleExport} variant="outline" className="border-[#EDF1F7]">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-[#222B45]">Attendance Records</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EDF1F7]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#222B45]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#222B45]">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#222B45]">Location</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#222B45]">
                    Total
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#222B45]">
                    Adults
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#222B45]">
                    Youth
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#222B45]">
                    Children
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-[#222B45]">
                    First Timers
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#222B45]">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#222B45]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-[#EDF1F7] hover:bg-[#F7F9FC] transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-[#8F9BB3]" />
                          <div>
                            <p className="text-sm font-medium text-[#222B45]">
                              {formatDate(record.date).split(',')[0]}
                            </p>
                            <p className="text-xs text-[#8F9BB3]">
                              {formatDate(record.date).split(',').slice(1).join(',')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-[#222B45]">{record.eventName}</p>
                          <p className="text-xs text-[#8F9BB3]">{record.eventType}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#8F9BB3]" />
                          <span className="text-sm text-[#8F9BB3]">{record.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-semibold text-[#222B45]">
                          {record.totalAttendance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-[#8F9BB3]">{record.adults}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-[#8F9BB3]">{record.youth}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-[#8F9BB3]">{record.children}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {record.firstTimers > 0 ? (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            {record.firstTimers}
                          </Badge>
                        ) : (
                          <span className="text-sm text-[#8F9BB3]">0</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleViewRecord(record)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEditRecord(record)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <div className="relative">
                            <Button
                              onClick={() =>
                                setOpenMenuId(openMenuId === record.id ? null : record.id)
                              }
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                            {openMenuId === record.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#EDF1F7] rounded-lg shadow-lg z-20">
                                  <button
                                    onClick={() => {
                                      handleViewRecord(record);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleEditRecord(record);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Record
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert('Generate report for this attendance record');
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                  >
                                    <BarChart3 className="w-4 h-4" />
                                    Generate Report
                                  </button>
                                  <div className="border-t border-[#EDF1F7] my-1" />
                                  <button
                                    onClick={() => {
                                      handleDeleteRecord(record);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Record
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <ClipboardCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#222B45] mb-2">
                          No Attendance Records Found
                        </h3>
                        <p className="text-sm text-[#8F9BB3] mb-4">
                          {searchQuery || categoryFilter !== 'all' || dateFilter !== 'all'
                            ? 'Try adjusting your filters to see more records.'
                            : 'Start recording attendance for your services and events.'}
                        </p>
                        {!searchQuery && categoryFilter === 'all' && dateFilter === 'all' && (
                          <Button
                            onClick={handleCreateAttendance}
                            className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Record First Attendance
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Attendance Modal */}
      <CreateAttendanceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}