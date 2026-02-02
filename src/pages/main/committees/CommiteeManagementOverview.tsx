import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateProjectModal from "@/components/modal/CreateProjectModal";
import EditProjectModal from "@/components/modal/EditProjectModal";
import ProjectDetailPage from "./ProjectDetailPage";
import CommitteeArchivePage from "./CommitteeArchivePage";
import { CompactProjectAlert } from "@/components/alert/ProjectNotificationAlert";
import {
  Briefcase,
  Plus,
  Users,
  Archive,
  TrendingUp,
  Search,
  Filter,
  FileDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Building2,
  Heart,
  Music,
  GraduationCap,
  Globe,
  ChevronDown,
  BarChart3,
} from "lucide-react";

interface Project {
  id: string;
  projectName: string;
  projectType:
    | "Evangelism"
    | "Worship"
    | "Education"
    | "Infrastructure"
    | "Welfare"
    | "Youth"
    | "General"
    | "Program"
    | "Event"
    | "Construction"
    | "Outreach";
  year: number;
  committeeSize: number;
  status: "Active" | "Completed" | "Planned";
  startDate: string;
  endDate?: string;
  description?: string;
  progress?: number;
}

export default function CommitteeManagementOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "archive">(
    "list"
  );

  // Mock projects data - now using state so we can add to it
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "p1",
      projectName: "Easter Revival Campaign 2025",
      projectType: "Evangelism",
      year: 2025,
      committeeSize: 12,
      status: "Active",
      startDate: "2025-01-10",
      endDate: "2025-04-20",
      description:
        "City-wide evangelism campaign leading up to Easter celebration",
      progress: 45,
    },
    {
      id: "p2",
      projectName: "New Worship Center Construction",
      projectType: "Infrastructure",
      year: 2025,
      committeeSize: 18,
      status: "Active",
      startDate: "2025-01-05",
      endDate: "2025-12-31",
      description: "Oversight of new worship center building project",
      progress: 30,
    },
    {
      id: "p3",
      projectName: "Youth Leadership Training Program",
      projectType: "Youth",
      year: 2025,
      committeeSize: 8,
      status: "Active",
      startDate: "2025-02-01",
      endDate: "2025-11-30",
      description: "Annual youth leadership development and mentorship program",
      progress: 25,
    },
    {
      id: "p4",
      projectName: "Sunday School Curriculum Review",
      projectType: "Education",
      year: 2025,
      committeeSize: 10,
      status: "Active",
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      description: "Review and update Sunday School teaching materials",
      progress: 60,
    },
    {
      id: "p5",
      projectName: "Community Welfare Outreach",
      projectType: "Welfare",
      year: 2025,
      committeeSize: 15,
      status: "Active",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      description: "Ongoing community support and welfare programs",
      progress: 40,
    },
    {
      id: "p6",
      projectName: "Annual Music Festival 2025",
      projectType: "Worship",
      year: 2025,
      committeeSize: 14,
      status: "Active",
      startDate: "2025-03-01",
      endDate: "2025-09-15",
      description: "Planning and execution of annual church music festival",
      progress: 35,
    },
    {
      id: "p7",
      projectName: "Christmas Celebration 2024",
      projectType: "General",
      year: 2024,
      committeeSize: 20,
      status: "Completed",
      startDate: "2024-09-01",
      endDate: "2024-12-25",
      description: "Church-wide Christmas celebration and outreach",
      progress: 100,
    },
    {
      id: "p8",
      projectName: "Building Renovation Phase 1",
      projectType: "Infrastructure",
      year: 2024,
      committeeSize: 12,
      status: "Completed",
      startDate: "2024-01-15",
      endDate: "2024-08-30",
      description: "Main sanctuary and offices renovation project",
      progress: 100,
    },
    {
      id: "p9",
      projectName: "Women Conference 2024",
      projectType: "General",
      year: 2024,
      committeeSize: 16,
      status: "Completed",
      startDate: "2024-05-01",
      endDate: "2024-08-15",
      description: "Annual women's conference and retreat",
      progress: 100,
    },
    {
      id: "p10",
      projectName: "Evangelism Crusade 2024",
      projectType: "Evangelism",
      year: 2024,
      committeeSize: 15,
      status: "Completed",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      description: "Regional evangelism crusade",
      progress: 100,
    },
  ]);

  // Available years for dropdown
  const availableYears = ["2025", "2024", "2023", "2022", "2021"];

  // Apply filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesYear =
      selectedYear === "all" || project.year.toString() === selectedYear;
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesType =
      typeFilter === "all" || project.projectType === typeFilter;

    return matchesSearch && matchesYear && matchesStatus && matchesType;
  });

  // Calculate stats
  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const currentYearCommittees = projects.filter((p) => p.year === 2025).length;
  const totalCommitteeMembers = projects
    .filter((p) => p.status === "Active")
    .reduce((sum, p) => sum + p.committeeSize, 0);
  const archivedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case "Evangelism":
        return <Globe className="w-4 h-4" />;
      case "Worship":
        return <Music className="w-4 h-4" />;
      case "Education":
        return <GraduationCap className="w-4 h-4" />;
      case "Infrastructure":
        return <Building2 className="w-4 h-4" />;
      case "Welfare":
        return <Heart className="w-4 h-4" />;
      case "Youth":
        return <Users className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const getProjectTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Evangelism":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Worship":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Education":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Infrastructure":
        return "bg-green-50 text-green-700 border-green-200";
      case "Welfare":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "Youth":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "Active"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSaveProject = (newProject: Project) => {
    // Add new project to the beginning of the list
    setProjects([newProject, ...projects]);
  };

  const handleEditProject = (updatedProject: Project) => {
    // Update the project in the list
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const handleDeleteProject = (projectId: string) => {
    // Remove the project from the list
    setProjects(projects.filter((p) => p.id !== projectId));
    // If we're in detail view, go back to list
    if (viewMode === "detail") {
      setViewMode("list");
      setSelectedProject(null);
    }
  };

  // If in detail view, show the Project Detail Page
  if (viewMode === "detail" && selectedProject) {
    return (
      <ProjectDetailPage
        project={selectedProject}
        onBack={() => {
          setViewMode("list");
          setSelectedProject(null);
        }}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />
    );
  }

  // If in archive view, show the Committee Archive Page
  if (viewMode === "archive") {
    return (
      <CommitteeArchivePage
        onNavigate={(page: string) => {
          if (page === "committee-overview") {
            setViewMode("list");
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#009AF4]/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#009AF4]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#222B45]">
                Committee Management
              </h1>
              <p className="text-[#8F9BB3] mt-1">
                Church projects and temporary committees
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => (window.location.href = "#committee-reports")}
            variant="outline"
            className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button
            className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            onClick={() => setIsCreateProjectModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Active Projects</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">
                  {activeProjects}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    Currently Running
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Committees This Year</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">
                  {currentYearCommittees}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Calendar className="w-3 h-3 text-[#009AF4]" />
                  <span className="text-xs text-[#8F9BB3]">2025</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#009AF4]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">
                  Total Committee Members
                </p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">
                  {totalCommitteeMembers}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <User className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600">Active Members</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8F9BB3]">Archived Projects</p>
                <p className="text-2xl font-semibold text-[#222B45] mt-1">
                  {archivedProjects}
                </p>
                <button
                  onClick={() => setViewMode("archive")}
                  className="flex items-center gap-1 mt-2 text-xs text-[#009AF4] hover:text-[#0086D6] transition-colors"
                >
                  <Archive className="w-3 h-3" />
                  <span>View Archive</span>
                </button>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                <Archive className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#009AF4]" />
            Project List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Year Selector and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Year Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-[#222B45] mb-2">
                Filter by Year
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full md:w-48 px-4 py-2.5 pr-10 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3] pointer-events-none" />
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#222B45] mb-2">
                Search Projects
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="text"
                  placeholder="Search by project name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Filter and Export Buttons */}
            <div className="flex gap-2 items-end">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Project Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="Evangelism">Evangelism</option>
                    <option value="Worship">Worship</option>
                    <option value="Education">Education</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Youth">Youth</option>
                    <option value="General">General</option>
                    <option value="Program">Program</option>
                    <option value="Event">Event</option>
                    <option value="Construction">Construction</option>
                    <option value="Outreach">Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#222B45] mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Projects Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F7F9FC] border-b border-[#EDF1F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Project Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Committee Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8F9BB3] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF1F7]">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#F7F9FC] transition-colors"
                  >
                    <td className="px-6 py-4" colSpan={6}>
                      <div className="space-y-3">
                        {/* Project Info Row */}
                        <div className="grid grid-cols-[minmax(0,2fr)_200px_120px_180px_200px_120px] gap-4">
                          {/* Project Name */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-[#009AF4]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[#222B45] truncate">
                                {project.projectName}
                              </p>
                              {project.description && (
                                <p className="text-xs text-[#8F9BB3] mt-0.5 truncate">
                                  {project.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1 text-xs text-[#8F9BB3]">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(project.startDate)}</span>
                                {project.endDate && (
                                  <>
                                    <span>→</span>
                                    <span>{formatDate(project.endDate)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Project Type */}
                          <div className="flex items-start pt-2">
                            <Badge
                              variant="outline"
                              className={getProjectTypeBadgeColor(
                                project.projectType
                              )}
                            >
                              {getProjectTypeIcon(project.projectType)}
                              <span className="ml-1">
                                {project.projectType}
                              </span>
                            </Badge>
                          </div>

                          {/* Year */}
                          <div className="flex items-start gap-2 pt-2">
                            <Calendar className="w-4 h-4 text-[#8F9BB3]" />
                            <span className="font-medium text-[#222B45]">
                              {project.year}
                            </span>
                          </div>

                          {/* Committee Size */}
                          <div className="flex items-start gap-2 pt-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-[#222B45]">
                                {project.committeeSize}
                              </span>
                              <span className="text-xs text-[#8F9BB3] ml-1">
                                members
                              </span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="space-y-2 pt-2">
                            <Badge
                              variant="outline"
                              className={getStatusBadgeColor(project.status)}
                            >
                              {project.status === "Active" ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Archive className="w-3 h-3 mr-1" />
                              )}
                              {project.status}
                            </Badge>
                            {project.progress !== undefined &&
                              project.status === "Active" && (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[#009AF4] transition-all duration-300"
                                      style={{ width: `${project.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-[#8F9BB3] font-medium">
                                    {project.progress}%
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-start justify-end pt-2">
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === project.id
                                      ? null
                                      : project.id
                                  )
                                }
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>

                              {openMenuId === project.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#EDF1F7] py-1 z-20">
                                    <button
                                      className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                      onClick={() => {
                                        setSelectedProject(project);
                                        setViewMode("detail");
                                        setOpenMenuId(null);
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2">
                                      <Users className="w-4 h-4" />
                                      Manage Committee
                                    </button>
                                    <button
                                      className="w-full px-4 py-2 text-left text-sm text-[#222B45] hover:bg-[#F7F9FC] flex items-center gap-2"
                                      onClick={() => {
                                        setSelectedProject(project);
                                        setIsEditProjectModalOpen(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit Project
                                    </button>
                                    <div className="border-t border-[#EDF1F7] my-1" />
                                    {project.status === "Active" ? (
                                      <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Mark as Completed
                                      </button>
                                    ) : (
                                      <button className="w-full px-4 py-2 text-left text-sm text-[#009AF4] hover:bg-blue-50 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Reactivate Project
                                      </button>
                                    )}
                                    <button
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      onClick={() =>
                                        handleDeleteProject(project.id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Project
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Inline Notification Alerts */}
                        {project.id === "p1" && project.status === "Active" && (
                          <CompactProjectAlert
                            type="leadership_expired"
                            message="Chairperson position has expired and requires immediate replacement"
                            severity="critical"
                            onClick={() => {
                              setSelectedProject(project);
                              setViewMode("detail");
                            }}
                          />
                        )}
                        {project.id === "p2" && project.status === "Active" && (
                          <CompactProjectAlert
                            type="leadership_expiring"
                            message="Secretary position will expire in 7 days"
                            severity="warning"
                            onClick={() => {
                              setSelectedProject(project);
                              setViewMode("detail");
                            }}
                          />
                        )}
                        {project.id === "p3" && project.status === "Active" && (
                          <CompactProjectAlert
                            type="no_leadership"
                            message="No Coordinator assigned - project leadership incomplete"
                            severity="warning"
                            onClick={() => {
                              setSelectedProject(project);
                              setViewMode("detail");
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-[#F7F9FC] rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-[#8F9BB3]" />
              </div>
              <h3 className="font-semibold text-[#222B45] mb-2">
                No projects found
              </h3>
              <p className="text-sm text-[#8F9BB3] mb-4">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first committee project to get started"}
              </p>
              <Button
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
                onClick={() => setIsCreateProjectModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            </div>
          )}

          {/* Results Count */}
          {filteredProjects.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-[#8F9BB3]">
              <p>
                Showing{" "}
                <span className="font-medium text-[#222B45]">
                  {filteredProjects.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#222B45]">
                  {projects.length}
                </span>{" "}
                projects
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-[#222B45]">
                    {
                      filteredProjects.filter((p) => p.status === "Active")
                        .length
                    }
                  </span>{" "}
                  Active
                </span>
                <span className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-[#222B45]">
                    {
                      filteredProjects.filter((p) => p.status === "Completed")
                        .length
                    }
                  </span>{" "}
                  Completed
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        onSave={handleEditProject}
        onDelete={handleDeleteProject}
        project={selectedProject}
      />
    </div>
  );
}
