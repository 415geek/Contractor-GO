"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, ChevronRight, MoreHorizontal } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'text-[#07C160] bg-[#E8F8EE]';
      case '待开始': return 'text-[#FA9D3B] bg-[#FFF8E8]';
      case '已完成': return 'text-[#B2B2B2] bg-[#F5F5F5]';
      default: return 'text-[#B2B2B2] bg-[#F5F5F5]';
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEDED] flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="h-[44px] bg-[#EDEDED] flex items-center justify-between px-1 sticky top-0 z-50 border-b border-[#D9D9D9]">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center px-2 py-2 active:opacity-70"
        >
          <ChevronLeft className="h-6 w-6 text-[#191919]" />
        </button>
        <h1 className="text-[17px] font-medium text-[#191919]">我的项目</h1>
        <button className="px-3 py-2 active:opacity-70">
          <Plus className="h-6 w-6 text-[#191919]" />
        </button>
      </header>

      <div className="flex-1 pt-2">
        {loading ? (
          <div className="bg-white">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-[#F0F0F0] animate-pulse">
                <div className="h-5 bg-[#F0F0F0] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#F0F0F0] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="bg-white">
            {projects.map((project, idx) => (
              <div 
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className={cn(
                  "p-4 active:bg-[#ECECEC] cursor-pointer",
                  idx !== projects.length - 1 && "border-b border-[#F0F0F0]"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="text-[16px] text-[#191919] font-medium truncate">{project.name}</h3>
                      <span className={cn(
                        "ml-2 text-[11px] px-1.5 py-0.5 rounded flex-shrink-0",
                        getStatusColor(project.status)
                      )}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#B2B2B2] mt-1 truncate">{project.address}</p>
                    <div className="flex items-center mt-2 text-[12px] text-[#B2B2B2]">
                      <span>客户: {project.client_name}</span>
                      <span className="mx-2">·</span>
                      <span>{new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#C4C4C4] flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-[48px] mb-4">📋</div>
            <p className="text-[#B2B2B2] text-[16px]">还没有项目</p>
            <button 
              onClick={() => {}}
              className="mt-4 text-[#07C160] text-[16px]"
            >
              创建第一个项目
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;