import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CSVImportModal from "@/components/modal/CSVImportModal";
import { getStatusBadgeColor } from "@/utils/statusBadge";
import {
  Search,
  UserPlus,
  Upload,
  Download,
  Filter,
  Eye,
  Pencil,
  Trash2,
  TriangleAlert,
  AlertCircle,
  Clock,
  X,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router";

interface Member {
  id: string;
  name: string;
  gender: string;
  age: number;
  band: string;
  units: string[];
  statusBadges: string[];
  flags: {
    overAge?: boolean;
    suspended?: boolean;
    incomplete?: boolean;
  };
}

interface MembershipListDashboardProps {
  onNavigateToEditMember?: () => void;
  onNavigateToProfile?: () => void;
}

export default function AllMembers({
  onNavigateToEditMember,
  onNavigateToProfile,
}: MembershipListDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: "all",
    band: "all",
    unit: "all",
    class: "all",
    status: "all",
  });

  // Mock data
  const members: Member[] = [
    {
      id: "BCM1001",
      name: "Sarah Johnson",
      gender: "Female",
      age: 24,
      band: "Choir Band",
      units: ["Music Ministry", "Ushering"],
      statusBadges: ["Baptism", "ETS", "Active"],
      flags: {},
    },
    {
      id: "BCM1002",
      name: "Michael Chen",
      gender: "Male",
      age: 19,
      band: "Youth Band",
      units: ["Media Team"],
      statusBadges: ["Pre Youth", "Active"],
      flags: {},
    },
    {
      id: "BCM1003",
      name: "Emily Davis",
      gender: "Female",
      age: 16,
      band: "Youth Band",
      units: ["Drama", "Choir"],
      statusBadges: ["Baptism", "Active"],
      flags: {},
    },
    {
      id: "BCM1004",
      name: "James Wilson",
      gender: "Male",
      age: 28,
      band: "Youth Band",
      units: ["Teaching"],
      statusBadges: ["Baptism", "ETS", "Active"],
      flags: { overAge: true },
    },
    {
      id: "BCM1005",
      name: "Jessica Martinez",
      gender: "Female",
      age: 15,
      band: "Children's Band",
      units: ["Sunday School"],
      statusBadges: ["Pre Youth", "Active"],
      flags: {},
    },
    {
      id: "BCM1006",
      name: "David Brown",
      gender: "Male",
      age: 22,
      band: "Youth Band",
      units: ["Music Ministry", "Protocol"],
      statusBadges: ["Baptism", "Active"],
      flags: { incomplete: true },
    },
    {
      id: "BCM1007",
      name: "Sophia Taylor",
      gender: "Female",
      age: 26,
      band: "Choir Band",
      units: ["Choir", "Counseling"],
      statusBadges: ["Baptism", "ETS", "Suspended"],
      flags: { suspended: true },
    },
    {
      id: "BCM1008",
      name: "Daniel Anderson",
      gender: "Male",
      age: 31,
      band: "Men's Band",
      units: ["Security"],
      statusBadges: ["Baptism", "ETS", "Overgrown Band"],
      flags: { overAge: true },
    },
    {
      id: "BCM1009",
      name: "Olivia Thomas",
      gender: "Female",
      age: 21,
      band: "Youth Band",
      units: ["Ushering", "First Aid"],
      statusBadges: ["Baptism", "ETS", "Active"],
      flags: {},
    },
    {
      id: "BCM1010",
      name: "Matthew Lee",
      gender: "Male",
      age: 17,
      band: "Youth Band",
      units: ["Media Team", "Sound"],
      statusBadges: ["Pre Youth", "Active"],
      flags: {},
    },
  ];

  const clearFilters = () => {
    setFilters({
      gender: "all",
      band: "all",
      unit: "all",
      class: "all",
      status: "all",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "all"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#222B45]">
            Membership List
          </h2>
          <p className="text-[#8F9BB3] mt-1">
            Manage and view all church members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
            onClick={() => setIsCSVModalOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Link to={"add"}>
            <Button className="bg-[#009AF4] hover:bg-[#0086D6] text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="text"
                  placeholder="Search by name, ID, band, or unit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 lg:flex-none border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009AF4] text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 lg:flex-none border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#EDF1F7]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Gender Filter */}
                <div>
                  <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters({ ...filters, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                    >
                      <option value="all">All Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                  </div>
                </div>

                {/* Band Filter */}
                <div>
                  <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                    Band
                  </label>
                  <div className="relative">
                    <select
                      value={filters.band}
                      onChange={(e) =>
                        setFilters({ ...filters, band: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                    >
                      <option value="all">All Bands</option>
                      <option value="choir">Choir Band</option>
                      <option value="youth">Youth Band</option>
                      <option value="children">Children's Band</option>
                      <option value="men">Men's Band</option>
                      <option value="women">Women's Band</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                  </div>
                </div>

                {/* Unit Filter */}
                <div>
                  <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                    Unit
                  </label>
                  <div className="relative">
                    <select
                      value={filters.unit}
                      onChange={(e) =>
                        setFilters({ ...filters, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                    >
                      <option value="all">All Units</option>
                      <option value="music">Music Ministry</option>
                      <option value="media">Media Team</option>
                      <option value="ushering">Ushering</option>
                      <option value="teaching">Teaching</option>
                      <option value="protocol">Protocol</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                  </div>
                </div>

                {/* Class Filter */}
                <div>
                  <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                    Class
                  </label>
                  <div className="relative">
                    <select
                      value={filters.class}
                      onChange={(e) =>
                        setFilters({ ...filters, class: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                    >
                      <option value="all">All Classes</option>
                      <option value="foundation">Foundation</option>
                      <option value="leadership">Leadership</option>
                      <option value="discipleship">Discipleship</option>
                      <option value="evangelism">Evangelism</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-medium text-[#8F9BB3] mb-1.5 block">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#EDF1F7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009AF4] appearance-none bg-white pr-8"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="baptism">Baptized</option>
                      <option value="preyouth">Pre Youth</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-3 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-[#009AF4] hover:text-[#0086D6] hover:bg-[#009AF4]/10"
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-[#009AF4]">
          <CardContent className="p-4">
            <div className="text-sm text-[#8F9BB3]">Total Members</div>
            <div className="text-2xl font-semibold text-[#222B45] mt-1">
              1,284
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-sm text-[#8F9BB3]">Active</div>
            <div className="text-2xl font-semibold text-[#222B45] mt-1">
              1,156
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-sm text-[#8F9BB3]">Overgrown</div>
            <div className="text-2xl font-semibold text-[#222B45] mt-1">42</div>
          </CardContent>
        </Card>
        <Card className="border-[#EDF1F7] shadow-sm border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-sm text-[#8F9BB3]">Suspended</div>
            <div className="text-2xl font-semibold text-[#222B45] mt-1">8</div>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EDF1F7] bg-[#F7F9FC]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Gender
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Age
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Band
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Units
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Flags
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[#222B45] whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-[#EDF1F7] hover:bg-[#F7F9FC] transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009AF4]/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-[#009AF4]">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[#222B45] whitespace-nowrap">
                            {member.name}
                          </div>
                          <div className="text-xs text-[#8F9BB3]">
                            {member.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">
                        {member.gender}
                      </span>
                    </td>

                    {/* Age */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45]">
                        {member.age}
                      </span>
                    </td>

                    {/* Band */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#222B45] whitespace-nowrap">
                        {member.band}
                      </span>
                    </td>

                    {/* Units */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {member.units.map((unit, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#EDF1F7] text-[#222B45] rounded text-xs whitespace-nowrap"
                          >
                            {unit}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {member.statusBadges.map((status, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={`text-xs whitespace-nowrap ${getStatusBadgeColor(
                              status
                            )}`}
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </td>

                    {/* Flags */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {member.flags.overAge && (
                          <div
                            className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"
                            title="Over age for current band"
                          >
                            <TriangleAlert className="w-4 h-4 text-orange-600" />
                          </div>
                        )}
                        {member.flags.suspended && (
                          <div
                            className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"
                            title="Member suspended"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                        {member.flags.incomplete && (
                          <div
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
                            title="Incomplete records"
                          >
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`profile/${member.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-[#009AF4]/10 hover:text-[#009AF4]"
                            title="View details"
                            onClick={onNavigateToProfile}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`edit/${member.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-[#009AF4]/10 hover:text-[#009AF4]"
                            title="Edit member"
                            onClick={onNavigateToEditMember}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          title="Delete member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#EDF1F7]">
            <p className="text-sm text-[#8F9BB3]">
              Showing <span className="font-medium text-[#222B45]">1-10</span>{" "}
              of <span className="font-medium text-[#222B45]">1,284</span>{" "}
              members
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-[#EDF1F7]"
              >
                Previous
              </Button>
              <Button
                size="sm"
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white min-w-9"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] min-w-9"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] min-w-9"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] min-w-9"
              >
                ...
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] min-w-9"
              >
                128
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImportComplete={(data) => {
          console.log("Import completed:", data);
          setIsCSVModalOpen(false);
        }}
      />
    </div>
  );
}
