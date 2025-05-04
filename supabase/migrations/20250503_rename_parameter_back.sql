
-- Fix the SQL function to match TypeScript expectations by using user_id parameter
-- while still avoiding the ambiguity issue
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id uuid)
 RETURNS TABLE(role_name text)
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
    SELECT ur.role::TEXT
    FROM public.user_roles ur
    WHERE ur.user_id = user_id;
END;
$function$;

-- Add a comment to document the function and the reason for the change
COMMENT ON FUNCTION public.get_user_roles(uuid) IS 'Returns roles for a given user, renamed parameter to match TypeScript expectations';
