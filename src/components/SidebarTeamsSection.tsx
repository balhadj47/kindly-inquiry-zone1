
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, Video, MessageSquare } from 'lucide-react';

const SidebarTeamsSection = () => {
  const teamMembers = [
    { name: 'Peter Taylor', avatar: '', status: 'online', icon: MessageSquare, iconColor: 'text-pink-500' },
    { name: 'Luvleen Lawrence', avatar: '', status: 'online', icon: Video, iconColor: 'text-purple-500' },
    { name: 'Su Hua', avatar: '', status: 'online', icon: MessageSquare, iconColor: 'text-green-500' },
  ];

  return (
    <div className="px-4 py-2 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium text-sm">Teams</h3>
        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 text-xs p-0 h-auto">
          VIEW ALL
          <Eye className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center justify-between group hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm">{member.name}</span>
            </div>
            <member.icon className={`h-4 w-4 ${member.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarTeamsSection;
