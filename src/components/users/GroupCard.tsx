
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2 } from 'lucide-react';
import { Group } from '@/types/rbac';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface GroupCardProps {
  group: Group;
  usersInGroup: number;
  canDelete: boolean;
  isDefaultGroup: boolean;
  onEdit: (group: Group) => void;
  onManagePermissions: (group: Group) => void;
  onDelete: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  usersInGroup,
  canDelete,
  isDefaultGroup,
  onEdit,
  onManagePermissions,
  onDelete,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} truncate`}>{group.name}</CardTitle>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 line-clamp-2`}>{group.description}</p>
          </div>
          <Badge className={`${group.color} ml-2 flex-shrink-0 ${isMobile ? 'text-xs px-2 py-1' : ''}`}>
            {usersInGroup} utilisateurs
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
          <p><span className="font-medium">{t.permissions}:</span> {group.permissions.length}</p>
        </div>
        
        <div className={`${isMobile ? 'space-y-2' : 'flex space-x-2'} pt-2`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(group)}
            className={`${isMobile ? 'w-full text-sm' : 'flex-1'}`}
          >
            {t.modify}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePermissions(group)}
            className={`${isMobile ? 'w-full text-sm' : 'flex-1'}`}
          >
            <Settings className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
            {t.permissions}
          </Button>
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`text-red-600 hover:text-red-700 hover:bg-red-50 ${
                    isMobile ? 'w-full text-sm' : ''
                  }`}
                >
                  <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${!isMobile ? 'mr-0' : 'mr-1'}`} />
                  {isMobile && 'Supprimer'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isMobile ? 'w-[95vw] max-w-md' : ''}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={isMobile ? 'text-base' : ''}>{t.deleteGroup}</AlertDialogTitle>
                  <AlertDialogDescription className={isMobile ? 'text-sm' : ''}>
                    {t.deleteGroupConfirm.replace('{name}', group.name)}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={isMobile ? 'flex-col gap-2' : ''}>
                  <AlertDialogCancel className={isMobile ? 'w-full text-sm' : ''}>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(group)}
                    className={`bg-red-600 hover:bg-red-700 ${isMobile ? 'w-full text-sm' : ''}`}
                  >
                    {t.delete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        {!canDelete && (
          <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 mt-2`}>
            {isDefaultGroup 
              ? t.defaultGroupCannotDelete
              : t.cannotDeleteGroupHasUsers.replace('{count}', usersInGroup.toString())
            }
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupCard;
