
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRBAC } from '@/contexts/RBACContext';
import { addRandomUsersToDatabase } from '@/utils/seedUsers';
import { Users, Plus } from 'lucide-react';

const AddRandomUsersButton: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { hasPermission } = useRBAC();

  const handleAddRandomUsers = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      await addRandomUsersToDatabase(10);
      
      // Reload the page to refresh the user list
      window.location.reload();
    } catch (error) {
      console.error('Error adding random users:', error);
      alert('Erreur lors de l\'ajout des utilisateurs aléatoires. Veuillez réessayer.');
    } finally {
      setIsAdding(false);
    }
  };

  // Only show this button if user has permission to create users
  if (!hasPermission('users:create')) {
    return null;
  }

  return (
    <Button
      onClick={handleAddRandomUsers}
      disabled={isAdding}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isAdding ? (
        <>
          <Plus className="h-4 w-4 animate-spin" />
          Ajout en cours...
        </>
      ) : (
        <>
          <Users className="h-4 w-4" />
          Ajouter 10 utilisateurs
        </>
      )}
    </Button>
  );
};

export default AddRandomUsersButton;
