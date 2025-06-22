
import { supabase } from '@/integrations/supabase/client';

export const createChangePasswordOperation = () => {
  const changeUserPassword = async (userEmail: string, newPassword: string) => {
    console.log('Changing password for user:', userEmail);
    
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

      // If user has an auth account, try to update password directly via admin API first
      if (userData?.auth_user_id) {
        console.log('Attempting direct password update via admin API for user:', userEmail);
        
        try {
          const { error: adminError } = await supabase.auth.admin.updateUserById(
            userData.auth_user_id,
            { password: newPassword }
          );

          if (!adminError) {
            console.log('Password updated successfully via admin API');
            return;
          }
          
          console.error('Admin API failed:', adminError);
          console.log('Falling back to password reset email...');
          
        } catch (adminUpdateError) {
          console.error('Error in admin password update:', adminUpdateError);
          console.log('Falling back to password reset email...');
        }
      } else {
        // User has no auth account, create one with the new password
        console.log('Creating new auth account for user...');
        
        try {
          const { data: authData, error: createError } = await supabase.auth.admin.createUser({
            email: userEmail,
            password: newPassword,
            email_confirm: true
          });

          if (createError) {
            console.error('Error creating auth user:', createError);
            throw new Error('Impossible de créer le compte utilisateur');
          }

          // Update user record with auth_user_id
          if (authData.user) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ auth_user_id: authData.user.id })
              .eq('id', userData.id);

            if (updateError) {
              console.error('Error updating user with auth_user_id:', updateError);
            }
          }
          
          console.log('New auth account created successfully with password');
          return;
          
        } catch (createError) {
          console.error('Error creating auth account:', createError);
          console.log('Falling back to password reset email...');
        }
      }

      // Fallback: send password reset email
      console.log('Sending password reset email to user:', userEmail);
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`
      });

      if (resetError) {
        console.error('Error sending password reset email:', resetError);
        throw new Error('Impossible de changer le mot de passe ou d\'envoyer l\'email de réinitialisation');
      }

      // Throw informational message about email being sent
      throw new Error(`Un email de réinitialisation de mot de passe a été envoyé à ${userEmail}. L'utilisateur devra suivre les instructions dans l'email pour définir son nouveau mot de passe.`);

    } catch (error) {
      console.error('Error in changeUserPassword operation:', error);
      throw error;
    }
  };

  return changeUserPassword;
};
