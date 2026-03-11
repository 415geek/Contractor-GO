"use client";

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, MapPin, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  start_date: string;
  address: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'bg-blue-100 text-blue-700';
      case '待开始': return 'bg-amber-100 text-amber-700';
      case '已完成': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerRight = (
    <Button size="sm" onClick={() => navigate('/projects/new')} className="hidden md:flex">
      <Plus className="h-4 w-4 mr-2" />
      新项目
    </Button>
  );

  return (
    <AppLayout title="项目" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="搜索项目..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:flex md:items-center md:space-x-4 md:pb-4">
          <span className="text-sm text-muted-foreground">筛选:</span>
          <Button variant="ghost" size="sm" className="text-primary">全部</Button>
          <Button variant="ghost" size="sm">进行中</Button>
          <Button variant="ghost" size="sm">待开始</Button>
          <Button variant="ghost" size="sm">已完成</Button>
          <div className="flex-1"></div>
          <Button onClick={() => navigate('/projects/new')}>
            <Plus className="h-4 w-4 mr-2" />
            新项目
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 md:gap-4">
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-xl font-bold text-primary">
                {projects.filter(p => p.status === '进行中').length}
              </div>
              <div className="text-xs text-muted-foreground">进行中</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-xl font-bold text-amber-600">
                {projects.filter(p => p.status === '待开始').length}
              </div>
              <div className="text-xs text-muted-foreground">待开始</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3 md:p-4">
              <div className="text-lg md:text-xl font-bold text-green-600">
                {projects.filter(p => p.status === '已完成').length}
              </div>
              <div className="text-xs text-muted-foreground">已完成</div>
            </CardContent>
          </Card>
          <Card className="text-center hidden md:block">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-purple-600">
                {projects.length}
              </div>
              <div className="text-xs text-muted-foreground">总计</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {filteredProjects.map((project) => (
              <Card 
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-shadow md:h-full"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground md:text-base">{project.name}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="line-clamp-1">{project.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">客户: {project.client_name}</span>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-muted-foreground mb-4">还没有项目</p>
              <Button onClick={() => navigate('/projects/new')}>
                创建第一个项目
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;