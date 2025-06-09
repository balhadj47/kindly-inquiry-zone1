
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2 } from 'lucide-react';
import { UserGroup } from '@/types/rbac';
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

interface GroupCardProps {
  group: UserGroup;
  usersInGroup: number;
  canDelete: boolean;
  isDefaultGroup: boolean;
  onEdit: (group: UserGroup) => void;
  onManagePermissions: (group: UserGroup) => void;
  onDelete: (group: UserGroup) => void;
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
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <p className="text-sm text-gray-600">{group.description}</p>
          </div>
          <Badge className={group.color}>
            {usersInGroup} utilisateurs
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Permissions:</span> {group.permissions.length}</p>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(group)}
            className="flex-1"
          >
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManagePermissions(group)}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-1" />
            Permissions
          </Button>
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le groupe</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer le groupe "{group.name}" ? 
                    Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(group)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        {!canDelete && (
          <p className="text-xs text-gray-500 mt-2">
            {isDefaultGroup 
              ? "Groupe par défaut - Ne peut pas être supprimé"
              : `Impossible de supprimer - ${usersInGroup} utilisateur(s) assigné(s)`
            }
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupCard;
