"use client";

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, ChevronRight, Users, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

  const ProjectSkeleton = () => (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="项目管理">
      <div className="p-4 space-y-4">
        <div className="flex gap-3">
          <Button className="flex-1 h-12 rounded-xl bg-indigo-600 shadow-md">
            <Plus className="mr-2 h-5 w-5" /> 新建项目
          </Button>
          <Button 
            variant="outline" 
            className="h-12 rounded-xl border-slate-200 bg-white text-slate-600"
            onClick={() => navigate('/clients')}
          >
            <Users className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <Card 
                key={project.id} 
                onClick={() => navigate(`/project/${project.id}`)}
                className="border-none shadow-sm rounded-2xl overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">客户: {project.client_name}</p>
                    </div>
                    <Badge className={cn(
                      "border-none rounded-full px-2 py-0.5 text-[10px]",
                      project.status === '进行中' ? "bg-blue-100 text-blue-700" : 
                      project.status === '待开始' ? "bg-amber-100 text-amber-700" : 
                      "bg-emerald-100 text-emerald-700"
                    )}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center text-[11px] text-slate-500">
                      <MapPin className="h-3 w-3 mr-1.5" />
                      {project.address}
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      创建日期: {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                    <span className="text-indigo-600 text-xs font-bold flex items-center">
                      查看详情 <ChevronRight className="ml-1 h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <Wrench className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="mt-4 font-semibold text-slate-700">还没有项目</h3>
              <p className="text-sm text-slate-500 mt-1">点击“新建项目”来开始第一个项目吧！</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;