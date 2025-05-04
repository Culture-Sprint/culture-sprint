
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUpgradeStatus = () => {
  const { user } = useAuth();
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpgradeStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_role_expirations')
          .select('expires_at')
          .eq('user_id', user.id)
          .eq('role', 'user')
          .maybeSingle();

        if (error) throw error;
        setExpirationDate(data?.expires_at || null);
      } catch (error) {
        console.error('Error fetching upgrade status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpgradeStatus();
  }, [user]);

  return { expirationDate, loading, setExpirationDate };
};
