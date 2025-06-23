
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the request is from an authenticated user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user has admin permissions
    const isKnownAdmin = user.email === 'gb47@msn.com'
    const userRoleId = user.user_metadata?.role_id || 0
    const isAdmin = userRoleId === 1 || isKnownAdmin
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Handle different HTTP methods
    if (req.method === 'GET') {
      // List all auth users
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
      
      if (error) {
        throw error
      }

      const formattedUsers = users.map(user => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        phone: user.phone,
        role: user.role || 'authenticated',
        user_metadata: user.user_metadata || {},
      }))

      return new Response(
        JSON.stringify({ users: formattedUsers }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'PUT') {
      // Update a user
      const body = await req.json()
      const userId = body.userId
      const updateData = body.updateData
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const userUpdatePayload: any = {}
      
      // Handle email update
      if (updateData.email) {
        userUpdatePayload.email = updateData.email
      }

      // Handle user metadata updates (name, role_id)
      if (updateData.name !== undefined || updateData.role_id !== undefined) {
        // Get current user metadata
        const { data: currentUser } = await supabaseAdmin.auth.admin.getUserById(userId)
        const currentMetadata = currentUser.user?.user_metadata || {}
        
        userUpdatePayload.user_metadata = {
          ...currentMetadata,
          ...(updateData.name !== undefined && { name: updateData.name }),
          ...(updateData.role_id !== undefined && { role_id: updateData.role_id })
        }
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, userUpdatePayload)
      
      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'DELETE') {
      // Delete a user
      const body = await req.json()
      const userId = body.userId
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
      
      if (error) {
        throw error
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in auth-users function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
