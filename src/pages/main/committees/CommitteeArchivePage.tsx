import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Archive,
  ChevronDown,
  ChevronRight,
  Calendar,
  Users,
  Crown,
  Download,
  Eye,
  Search,
  Filter,
  Briefcase,
  Building2,
  Heart,
  Globe,
  Music,
  GraduationCap,
  Target,
  CheckCircle,
  TrendingUp,
  BarChart3,
  MapPin,
} from 'lucide-react';

interface ArchivedProject {
  id: string;
  projectName: string;
  projectType: 'Evangelism' | 'Worship' | 'Education' | 'Infrastructure' | 'Welfare' | 'Youth' | 'General' | 'Program' | 'Event' | 'Construction' | 'Outreach';
  year: number;
  committeeCount: number;
  status: 'Completed' | 'Archived';
  startDate: string;
  endDate: string;
  leadership: {
    chairperson?: { name: string; unit: string; email: string };
    secretary?: { name: string; unit: string; email: string };
    coordinator?: { name: string; unit: string; email: string };
  };
  completedDate?: string;
  achievements?: string;
}

interface CommitteeArchivePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function CommitteeArchivePage({ onNavigate }: CommitteeArchivePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [expandedYears, setExpandedYears] = useState<number[]>([2024]);

  // Mock archived projects data
  const archivedProjects: ArchivedProject[] = [
    {
      id: 'ap1',
      projectName: 'Christmas Carol Service 2024',
      projectType: 'Worship',
      year: 2024,
      committeeCount: 12,
      status: 'Completed',
      startDate: '2024-11-01',
      endDate: '2024-12-25',
      completedDate: '2024-12-25',
      leadership: {
        chairperson: { name: 'Pastor Michael Osei', unit: 'Accra Central', email: 'michael.osei@church.org' },
        secretary: { name: 'Sister Sarah Adu', unit: 'Tema', email: 'sarah.adu@church.org' },
        coordinator: { name: 'Brother Felix Mensah', unit: 'Kumasi', email: 'felix.mensah@church.org' },
      },
      achievements: 'Successfully hosted 3 services with over 2,000 attendees',
    },
    {
      id: 'ap2',
      projectName: 'Youth Leadership Summit 2024',
      projectType: 'Youth',
      year: 2024,
      committeeCount: 15,
      status: 'Completed',
      startDate: '2024-08-01',
      endDate: '2024-10-15',
      completedDate: '2024-10-15',
      leadership: {
        chairperson: { name: 'Brother Daniel Appiah', unit: 'Takoradi', email: 'daniel.appiah@church.org' },
        secretary: { name: 'Sister Joyce Owusu', unit: 'Cape Coast', email: 'joyce.owusu@church.org' },
        coordinator: { name: 'Brother Richard Boateng', unit: 'Accra Central', email: 'richard.boateng@church.org' },
      },
      achievements: '250+ youth leaders trained across 5 regions',
    },
    {
      id: 'ap3',
      projectName: 'Church Building Renovation Phase 2',
      projectType: 'Infrastructure',
      year: 2024,
      committeeCount: 8,
      status: 'Completed',
      startDate: '2024-03-01',
      endDate: '2024-09-30',
      completedDate: '2024-09-30',
      leadership: {
        chairperson: { name: 'Elder Joseph Asamoah', unit: 'Accra Central', email: 'joseph.asamoah@church.org' },
        secretary: { name: 'Brother Thomas Darko', unit: 'Tema', email: 'thomas.darko@church.org' },
      },
      achievements: 'Completed all renovations under budget by 15%',
    },
    {
      id: 'ap4',
      projectName: 'Community Welfare Program 2024',
      projectType: 'Welfare',
      year: 2024,
      committeeCount: 10,
      status: 'Completed',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      completedDate: '2024-12-31',
      leadership: {
        chairperson: { name: 'Sister Rebecca Mensah', unit: 'Kumasi', email: 'rebecca.mensah@church.org' },
        secretary: { name: 'Brother Samuel Nkrumah', unit: 'Accra Central', email: 'samuel.nkrumah@church.org' },
        coordinator: { name: 'Sister Mary Adjei', unit: 'Tema', email: 'mary.adjei@church.org' },
      },
      achievements: 'Supported 500+ families with food and medical assistance',
    },
    {
      id: 'ap5',
      projectName: 'Easter Convention 2023',
      projectType: 'Evangelism',
      year: 2023,
      committeeCount: 18,
      status: 'Completed',
      startDate: '2023-02-01',
      endDate: '2023-04-09',
      completedDate: '2023-04-09',
      leadership: {
        chairperson: { name: 'Pastor Stephen Addo', unit: 'Accra Central', email: 'stephen.addo@church.org' },
        secretary: { name: 'Sister Grace Boateng', unit: 'Takoradi', email: 'grace.boateng@church.org' },
        coordinator: { name: 'Brother Emmanuel Asare', unit: 'Kumasi', email: 'emmanuel.asare@church.org' },
      },
      achievements: '1,200+ souls won, 5-day convention successfully executed',
    },
    {
      id: 'ap6',
      projectName: 'Music Ministry Workshop 2023',
      projectType: 'Worship',
      year: 2023,
      committeeCount: 9,
      status: 'Completed',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      completedDate: '2023-08-31',
      leadership: {
        chairperson: { name: 'Brother Philip Mensah', unit: 'Cape Coast', email: 'philip.mensah@church.org' },
        secretary: { name: 'Sister Elizabeth Osei', unit: 'Tema', email: 'elizabeth.osei@church.org' },
      },
      achievements: '100+ worship leaders equipped with new skills',
    },
    {
      id: 'ap7',
      projectName: 'Education Support Initiative 2023',
      projectType: 'Education',
      year: 2023,
      committeeCount: 11,
      status: 'Completed',
      startDate: '2023-01-10',
      endDate: '2023-12-20',
      completedDate: '2023-12-20',
      leadership: {
        chairperson: { name: 'Sister Victoria Agyemang', unit: 'Kumasi', email: 'victoria.agyemang@church.org' },
        secretary: { name: 'Brother Isaac Frimpong', unit: 'Accra Central', email: 'isaac.frimpong@church.org' },
        coordinator: { name: 'Sister Comfort Owusu', unit: 'Takoradi', email: 'comfort.owusu@church.org' },
      },
      achievements: 'Provided scholarships to 200 students',
    },
    {
      id: 'ap8',
      projectName: 'Annual Harvest Celebration 2022',
      projectType: 'Event',
      year: 2022,
      committeeCount: 14,
      status: 'Completed',
      startDate: '2022-10-01',
      endDate: '2022-11-30',
      completedDate: '2022-11-30',
      leadership: {
        chairperson: { name: 'Elder Benjamin Ansah', unit: 'Accra Central', email: 'benjamin.ansah@church.org' },
        secretary: { name: 'Sister Patience Kumi', unit: 'Tema', email: 'patience.kumi@church.org' },
        coordinator: { name: 'Brother Francis Adu', unit: 'Cape Coast', email: 'francis.adu@church.org' },
      },
      achievements: 'Raised GHS 500,000 for church development',
    },
    {
      id: 'ap9',
      projectName: 'Outreach Campaign 2022',
      projectType: 'Outreach',
      year: 2022,
      committeeCount: 16,
      status: 'Completed',
      startDate: '2022-03-15',
      endDate: '2022-09-30',
      completedDate: '2022-09-30',
      leadership: {
        chairperson: { name: 'Pastor Charles Mensah', unit: 'Kumasi', email: 'charles.mensah@church.org' },
        secretary: { name: 'Sister Agnes Boakye', unit: 'Accra Central', email: 'agnes.boakye@church.org' },
      },
      achievements: 'Reached 10 communities with the gospel',
    },
    {
      id: 'ap10',
      projectName: 'Women\'s Conference 2022',
      projectType: 'Program',
      year: 2022,
      committeeCount: 13,
      status: 'Completed',
      startDate: '2022-05-01',
      endDate: '2022-07-15',
      completedDate: '2022-07-15',
      leadership: {
        chairperson: { name: 'Sister Margaret Ofosu', unit: 'Tema', email: 'margaret.ofosu@church.org' },
        secretary: { name: 'Sister Beatrice Appiah', unit: 'Takoradi', email: 'beatrice.appiah@church.org' },
        coordinator: { name: 'Sister Ruth Mensah', unit: 'Cape Coast', email: 'ruth.mensah@church.org' },
      },
      achievements: '800+ women attended, life-changing testimonies recorded',
    },
  ];

  const projectTypes = [
    'All',
    'Evangelism',
    'Worship',
    'Education',
    'Infrastructure',
    'Welfare',
    'Youth',
    'Event',
    'Outreach',
    'Program',
  ];

  // Filter projects
  const filteredProjects = archivedProjects.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.leadership.chairperson?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.leadership.secretary?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.leadership.coordinator?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || project.projectType === selectedType;

    return matchesSearch && matchesType;
  });

  // Group projects by year
  const projectsByYear = filteredProjects.reduce((acc, project) => {
    if (!acc[project.year]) {
      acc[project.year] = [];
    }
    acc[project.year].push(project);
    return acc;
  }, {} as Record<number, ArchivedProject[]>);

  const years = Object.keys(projectsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const toggleYear = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter((y) => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'Evangelism':
        return <Globe className="w-4 h-4" />;
      case 'Worship':
        return <Music className="w-4 h-4" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4" />;
      case 'Infrastructure':
      case 'Construction':
        return <Building2 className="w-4 h-4" />;
      case 'Welfare':
      case 'Outreach':
        return <Heart className="w-4 h-4" />;
      case 'Youth':
        return <Users className="w-4 h-4" />;
      case 'Program':
      case 'Event':
        return <Target className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  const handleExportCommitteeList = (projectId: string, projectName: string) => {
    console.log('Exporting committee list for:', projectId);
    // Implement export functionality
    alert(`Exporting committee list for "${projectName}"`);
  };

  const handleViewProject = (projectId: string) => {
    console.log('Viewing project:', projectId);
    // Navigate to project detail page
    onNavigate('project-detail', { projectId });
  };

  // Calculate statistics
  const totalProjects = filteredProjects.length;
  const totalCommitteeMembers = filteredProjects.reduce((sum, p) => sum + p.committeeCount, 0);
  const uniqueLeaders = new Set([
    ...filteredProjects.flatMap((p) => [
      p.leadership.chairperson?.name,
      p.leadership.secretary?.name,
      p.leadership.coordinator?.name,
    ].filter(Boolean)),
  ]).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#222B45] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
              <Archive className="w-5 h-5 text-[#009AF4]" />
            </div>
            Committee Archive
          </h1>
          <p className="text-sm text-[#8F9BB3] mt-1">
            Historical records of completed committee projects and leadership
          </p>
        </div>
        <Button
          onClick={() => onNavigate('committee-overview')}
          variant="outline"
          className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Back to Active Projects
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Archived Projects</p>
                <p className="text-3xl font-semibold text-[#222B45]">{totalProjects}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All completed
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Archive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8F9BB3] mb-1">Total Committee Members</p>
                <p className="text-3xl font-semibold text-[#222B45]">{totalCommitteeMembers}</p>
                <p className="text-xs text-[#8F9BB3] mt-1">Across all projects</p>
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
                <p className="text-sm text-[#8F9BB3] mb-1">Unique Leaders</p>
                <p className="text-3xl font-semibold text-[#222B45]">{uniqueLeaders}</p>
                <p className="text-xs text-[#8F9BB3] mt-1">Leadership positions filled</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-[#EDF1F7] shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project name, type, or leader..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#EDF1F7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009AF4] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'All' ? 'All Project Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedType !== 'All') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#EDF1F7]">
              <p className="text-sm text-[#8F9BB3]">Active filters:</p>
              {searchQuery && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-blue-900"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedType !== 'All' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Type: {selectedType}
                  <button
                    onClick={() => setSelectedType('All')}
                    className="ml-2 hover:text-purple-900"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Archived Projects by Year */}
      {years.length > 0 ? (
        <div className="space-y-4">
          {years.map((year) => {
            const isExpanded = expandedYears.includes(year);
            const yearProjects = projectsByYear[year];

            return (
              <Card key={year} className="border-[#EDF1F7] shadow-sm overflow-hidden">
                {/* Year Header */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full p-6 flex items-center justify-between hover:bg-[#F7F9FC] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#009AF4]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#009AF4]" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-[#222B45]">{year}</h3>
                      <p className="text-sm text-[#8F9BB3]">
                        {yearProjects.length} {yearProjects.length === 1 ? 'project' : 'projects'} •{' '}
                        {yearProjects.reduce((sum, p) => sum + p.committeeCount, 0)} committee members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {yearProjects.length} Completed
                    </Badge>
                  </div>
                </button>

                {/* Year Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4">
                    {yearProjects.map((project) => (
                      <Card key={project.id} className="border-[#EDF1F7] hover:border-[#009AF4] transition-colors">
                        <CardContent className="p-5">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            {/* Left: Project Info */}
                            <div className="flex-1 space-y-4">
                              {/* Header */}
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center flex-shrink-0">
                                  {getProjectTypeIcon(project.projectType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-[#222B45] mb-1">{project.projectName}</h4>
                                  <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      <Target className="w-3 h-3 mr-1" />
                                      {project.projectType}
                                    </Badge>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      {project.status}
                                    </Badge>
                                    <span className="text-xs text-[#8F9BB3] flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(project.startDate)} → {formatDate(project.endDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Committee Count */}
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-[#009AF4]" />
                                <span className="font-medium text-[#222B45]">{project.committeeCount}</span>
                                <span className="text-[#8F9BB3]">committee members</span>
                              </div>

                              {/* Leadership Summary */}
                              <div className="p-4 bg-[#F7F9FC] border border-[#EDF1F7] rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <Crown className="w-4 h-4 text-[#009AF4]" />
                                  <p className="text-sm font-medium text-[#222B45]">Committee Leadership</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {/* Chairperson */}
                                  {project.leadership.chairperson ? (
                                    <div>
                                      <p className="text-xs text-[#8F9BB3] mb-1">Chairperson</p>
                                      <p className="text-sm font-medium text-[#222B45]">
                                        {project.leadership.chairperson.name}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-[#8F9BB3] mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        {project.leadership.chairperson.unit}
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-xs text-[#8F9BB3] mb-1">Chairperson</p>
                                      <p className="text-sm text-gray-400">Not assigned</p>
                                    </div>
                                  )}

                                  {/* Secretary */}
                                  {project.leadership.secretary ? (
                                    <div>
                                      <p className="text-xs text-[#8F9BB3] mb-1">Secretary</p>
                                      <p className="text-sm font-medium text-[#222B45]">
                                        {project.leadership.secretary.name}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-[#8F9BB3] mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        {project.leadership.secretary.unit}
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-xs text-[#8F9BB3] mb-1">Secretary</p>
                                      <p className="text-sm text-gray-400">Not assigned</p>
                                    </div>
                                  )}

                                  {/* Coordinator */}
                                  {project.leadership.coordinator ? (
                                    <div>
                                      <p className="text-xs text-[#8F9BB3] mb-1">Coordinator</p>
                                      <p className="text-sm font-medium text-[#222B45]">
                                        {project.leadership.coordinator.name}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-[#8F9BB3] mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                        {project.leadership.coordinator.unit}
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-xs text-[#8F9BB3] mb-1">Coordinator</p>
                                      <p className="text-sm text-gray-400">Not assigned</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Achievements */}
                              {project.achievements && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                                  <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-green-900 mb-0.5">Key Achievement</p>
                                    <p className="text-sm text-green-800">{project.achievements}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                              <Button
                                size="sm"
                                onClick={() => handleViewProject(project.id)}
                                className="bg-[#009AF4] hover:bg-[#0086D6] text-white flex-1 lg:flex-none"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Project
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportCommitteeList(project.id, project.projectName)}
                                className="border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4] flex-1 lg:flex-none"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export List
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="border-[#EDF1F7] shadow-sm">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Archive className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#222B45] mb-2">No Archived Projects Found</h3>
              <p className="text-sm text-[#8F9BB3] max-w-md">
                {searchQuery || selectedType !== 'All'
                  ? 'No projects match your current filters. Try adjusting your search criteria.'
                  : 'There are no archived projects yet. Completed projects will appear here.'}
              </p>
              {(searchQuery || selectedType !== 'All') && (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('All');
                  }}
                  variant="outline"
                  className="mt-4 border-[#EDF1F7] hover:border-[#009AF4] hover:text-[#009AF4]"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export All */}
      {years.length > 0 && (
        <Card className="border-[#EDF1F7] shadow-sm bg-[#F7F9FC]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#009AF4]/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#009AF4]" />
                </div>
                <div>
                  <p className="font-medium text-[#222B45]">Full Archive Report</p>
                  <p className="text-sm text-[#8F9BB3]">
                    Export complete committee archive with all projects and members
                  </p>
                </div>
              </div>
              <Button
                onClick={() => alert('Exporting full archive report...')}
                className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Full Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
