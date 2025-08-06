
-- Create a helper function to get employee notes
CREATE OR REPLACE FUNCTION public.get_employee_notes(p_employee_id integer)
RETURNS TABLE (
  id uuid,
  employee_id integer,
  date date,
  category text,
  title text,
  details text,
  created_at timestamp with time zone,
  created_by uuid
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    en.id,
    en.employee_id,
    en.date,
    en.category,
    en.title,
    en.details,
    en.created_at,
    en.created_by
  FROM public.employee_notes en
  WHERE en.employee_id = p_employee_id
  ORDER BY en.date DESC, en.created_at DESC;
$$;
