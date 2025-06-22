
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRBAC } from '@/contexts/RBACContext';
import { User } from '@/types/rbac';
import { Eye, EyeOff, Mail } from 'lucide-react';

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
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    }
  });

  const handleSendResetEmail = async () => {
    if (!user || !user.email) {
      setError('Adresse email manquante pour cet utilisateur');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await changeUserPassword(user.email, ''); // Password not used for reset email
      if (result && result.success) {
        setEmailSent(true);
        setSuccess(true);
        setTimeout(() => {
          setEmailSent(false);
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setError(error.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setError('');
    setSuccess(false);
    setEmailSent(false);
    onClose();
  };

  if (!user || !user.email) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Impossible de Changer le Mot de Passe</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              Cet utilisateur n'a pas d'adresse email associée. Impossible d'envoyer un email de réinitialisation.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end pt-4">
            <Button onClick={handleClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            Réinitialiser le Mot de Passe
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Utilisateur: {user.name} ({user.email})
          </p>
        </DialogHeader>
        
        {success && emailSent && (
          <Alert className="border-green-200 bg-green-50">
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-green-800">
              Email de réinitialisation envoyé avec succès à {user.email}
            </AlertDescription>
          </Alert>
        )}

        {!emailSent && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Un email de réinitialisation sera envoyé à l'utilisateur avec des instructions pour créer un nouveau mot de passe.
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button onClick={handleSendResetEmail} disabled={isSubmitting || success}>
                {isSubmitting ? 'Envoi...' : 'Envoyer Email de Réinitialisation'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeModal;
