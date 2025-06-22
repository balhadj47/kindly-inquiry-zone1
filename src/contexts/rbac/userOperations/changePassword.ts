
import { supabase } from '@/integrations/supabase/client';

export const createChangePasswordOperation = () => {
  const changeUserPassword = async (userEmail: string, newPassword: string) => {
    console.log('Initiating password reset for user:', userEmail);
    
    try {
      // Check if user exists in our database
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('auth_user_id, id, name')
        .eq('email', userEmail)
        .single();

      if (fetchError) {
        console.error('Error fetching user data:', fetchError);
        throw new Error('Utilisateur non trouvé dans le système');
      }

      // Send password reset email - this is the safest approach from frontend
      console.log('Sending password reset email to user:', userEmail);
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`
      });

      if (resetError) {
        console.error('Error sending password reset email:', resetError);
        throw new Error('Impossible d\'envoyer l\'email de réinitialisation de mot de passe');
      }

      // Success message - don't throw as error, return success
      console.log('Password reset email sent successfully');
      return {
        success: true,
        message: `Un email de réinitialisation de mot de passe a été envoyé à ${userEmail}. L'utilisateur devra suivre les instructions dans l'email pour définir son nouveau mot de passe.`
      };

    } catch (error) {
      console.error('Error in changeUserPassword operation:', error);
      throw error;
    }
  };

  return changeUserPassword;
};
