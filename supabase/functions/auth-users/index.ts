
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log(`📥 Received ${req.method} request to auth-users`)
    
    // Create supabase client with service role key for admin operations
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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ No authorization header')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enhanced permission checking - check user's actual permissions
    const isKnownAdmin = user.email === 'gb47@msn.com'
    const userRoleId = user.user_metadata?.role_id || 0
    const isRoleAdmin = userRoleId === 1
    
    console.log('🔍 User permissions check:', {
      email: user.email,
      userRoleId,
      isKnownAdmin,
      isRoleAdmin
    })
    
    // If known admin or role admin, grant access immediately
    if (isKnownAdmin || isRoleAdmin) {
      console.log('✅ Admin access granted')
    } else {
      // For other users, check their specific permissions from user_groups table
      try {
        const { data: userGroupData, error: userGroupError } = await supabaseAdmin
          .from('user_groups')
          .select('permissions')
          .eq('role_id', userRoleId)
          .single()
        
        if (userGroupError) {
          console.error('❌ Error fetching user group permissions:', userGroupError)
          return new Response(
            JSON.stringify({ error: 'Error checking permissions' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        const permissions = userGroupData?.permissions || []
        console.log('🔍 User permissions from database:', permissions)
        
        // Check if user has any auth-users related permissions
        const hasAuthUsersPermission = permissions.some((perm: string) => 
          perm.startsWith('auth-users:') || perm === 'users:read'
        )
        
        // High privilege user (many permissions) can also access
        const isHighPrivilegeUser = permissions.length >= 10
        
        if (!hasAuthUsersPermission && !isHighPrivilegeUser) {
          console.error('❌ Insufficient permissions - no auth-users access')
          return new Response(
            JSON.stringify({ error: 'Insufficient permissions' }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        
        console.log('✅ Permission granted via database check')
      } catch (permError) {
        console.error('❌ Error during permission check:', permError)
        return new Response(
          JSON.stringify({ error: 'Permission check failed' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Handle different HTTP methods
    if (req.method === 'GET') {
      console.log('📋 Listing all auth users...')
      
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
      
      if (error) {
        console.error('❌ Error listing users:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
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

      console.log('✅ Found', formattedUsers.length, 'auth users')

      return new Response(
        JSON.stringify({ users: formattedUsers }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      let body
      try {
        body = await req.json()
      } catch (e) {
        console.error('❌ Invalid JSON in request body:', e)
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { email, password, name, role_id } = body
      
      console.log('🆕 Creating new auth user:', email)
      
      if (!email || !password || !name) {
        console.error('❌ Missing required fields')
        return new Response(
          JSON.stringify({ error: 'Email, password, and name are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      try {
        // Create the auth user
        const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: password,
          user_metadata: {
            name: name,
            role_id: role_id || 2
          },
          email_confirm: true // Auto-confirm the email
        })
        
        if (createError) {
          console.error('❌ Error creating auth user:', createError)
          return new Response(
            JSON.stringify({ error: `Failed to create auth user: ${createError.message}` }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('✅ Successfully created auth user:', authData.user?.id)

        return new Response(
          JSON.stringify({ success: true, user: authData.user }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } catch (createError) {
        console.error('❌ Unexpected error during user creation:', createError)
        return new Response(
          JSON.stringify({ error: `Unexpected error: ${createError.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    if (req.method === 'PUT') {
      let body
      try {
        body = await req.json()
      } catch (e) {
        console.error('❌ Invalid JSON in request body:', e)
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const userId = body.userId
      const updateData = body.updateData
      
      console.log('📝 Updating auth user:', userId, updateData)
      
      if (!userId) {
        console.error('❌ User ID required')
        return new Response(
          JSON.stringify({ error: 'User ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        console.error('❌ Update data required')
        return new Response(
          JSON.stringify({ error: 'Update data required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      try {
        const userUpdatePayload: any = {}
        
        // Handle email update
        if (updateData.email) {
          userUpdatePayload.email = updateData.email
        }

        // Handle user metadata updates (name, role_id)
        if (updateData.name !== undefined || updateData.role_id !== undefined) {
          // Get current user metadata
          const { data: currentUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
          
          if (getUserError) {
            console.error('❌ Error getting current user:', getUserError)
            return new Response(
              JSON.stringify({ error: `Failed to get current user: ${getUserError.message}` }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          const currentMetadata = currentUser.user?.user_metadata || {}
          
          userUpdatePayload.user_metadata = {
            ...currentMetadata,
            ...(updateData.name !== undefined && { name: updateData.name }),
            ...(updateData.role_id !== undefined && { role_id: updateData.role_id })
          }
        }

        console.log('🔄 Update payload:', userUpdatePayload)

        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, userUpdatePayload)
        
        if (updateError) {
          console.error('❌ Error updating user:', updateError)
          return new Response(
            JSON.stringify({ error: `Failed to update user: ${updateError.message}` }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('✅ Successfully updated user:', updatedUser.user?.id)

        return new Response(
          JSON.stringify({ success: true, user: updatedUser.user }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } catch (updateError) {
        console.error('❌ Unexpected error during update:', updateError)
        return new Response(
          JSON.stringify({ error: `Unexpected error: ${updateError.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    if (req.method === 'DELETE') {
      let body
      try {
        body = await req.json()
      } catch (e) {
        console.error('❌ Invalid JSON in request body:', e)
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const userId = body.userId
      
      console.log('🗑️ Deleting auth user:', userId)
      
      if (!userId) {
        console.error('❌ User ID required')
        return new Response(
          JSON.stringify({ error: 'User ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Prevent deleting own account
      if (userId === user.id) {
        console.error('❌ Cannot delete own account')
        return new Response(
          JSON.stringify({ error: 'Cannot delete your own account' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      try {
        const { data, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (deleteError) {
          console.error('❌ Error deleting user:', deleteError)
          return new Response(
            JSON.stringify({ error: `Failed to delete user: ${deleteError.message}` }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('✅ Successfully deleted user:', userId)

        return new Response(
          JSON.stringify({ success: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } catch (deleteError) {
        console.error('❌ Unexpected error during delete:', deleteError)
        return new Response(
          JSON.stringify({ error: `Unexpected error: ${deleteError.message}` }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.error('❌ Method not allowed:', req.method)
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Error in auth-users function:', error)
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
