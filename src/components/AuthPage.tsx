
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

console.log('🔐 AuthPage: Component loading...');
console.log('🔐 AuthPage: useAuth hook:', useAuth);

const AuthPage = () => {
  console.log('🔐 AuthPage: Component rendering...');
  
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('🔐 AuthPage: Auth state - user:', user, 'loading:', loading);

  // If user is already authenticated, redirect to main page
  if (!loading && user) {
    console.log('🔐 AuthPage: User authenticated, redirecting...');
    return <Navigate to="/" replace />;
  }

  // Show loading spinner while checking auth state
  if (loading) {
    console.log('🔐 AuthPage: Showing loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    console.log('🔐 AuthPage: Attempting sign in...');
    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('🔐 AuthPage: Sign in error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError(error.message);
      }
    }
    
    setIsSubmitting(false);
  };

  console.log('🔐 AuthPage: Rendering sign in form...');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder à l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Contactez votre administrateur pour créer un compte</p>
            <p className="mt-2 text-xs">
              © 2024 asdar it | <a href="https://asdar.net" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">asdar.net</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

console.log('🔐 AuthPage: Component defined, exporting...');

export default AuthPage;
