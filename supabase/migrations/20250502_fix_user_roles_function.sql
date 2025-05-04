
-- Fix the ambiguous column reference in get_user_roles function
CREATE OR REPLACE FUNCTION public.get_user_roles(input_user_id uuid)
 RETURNS TABLE(role_name text)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT ur.role::TEXT
    FROM public.user_roles ur
    WHERE ur.user_id = input_user_id;
END;
$function$;

-- Add a comment to document the function
COMMENT ON FUNCTION public.get_user_roles(uuid) IS 'Returns roles for a given user, avoiding column ambiguity';
