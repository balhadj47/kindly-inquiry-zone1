
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRBAC } from '@/contexts/RBACContext';
import { User } from '@/types/rbac';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose, user }) => {
  const { changeUserPassword } = useRBAC();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    }
  });

  const handleSubmit = async (data: PasswordFormData) => {
    if (!user) return;

    if (data.newPassword !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (data.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await changeUserPassword(user.email, data.newPassword);
      setSuccess(true);
      form.reset();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setError(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            Changer le Mot de Passe
          </DialogTitle>
          {user && (
            <p className="text-sm text-muted-foreground">
              Utilisateur: {user.name} ({user.email})
            </p>
          )}
        </DialogHeader>
        
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Mot de passe changé avec succès!
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              rules={{ 
                required: 'Le nouveau mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau Mot de Passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nouveau mot de passe"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{ 
                required: 'La confirmation du mot de passe est requise'
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le Mot de Passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmer le mot de passe"
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || success}>
                {isSubmitting ? 'Changement...' : 'Changer le Mot de Passe'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;
