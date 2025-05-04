
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { UpgradeCode } from "../types/upgrade-code";

export const useUpgradeCodes = (userId: string | undefined) => {
  const [codes, setCodes] = useState<UpgradeCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('upgrade_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (expirationDays: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not available",
        variant: "destructive",
      });
      return;
    }

    setGeneratingCode(true);
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(expirationDays));

      const { error } = await supabase
        .from('upgrade_codes')
        .insert({
          code,
          expires_at: expiryDate.toISOString(),
          created_by: userId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `New code generated: ${code}`,
      });

      fetchCodes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setGeneratingCode(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  return {
    codes,
    loading,
    generatingCode,
    generateCode,
  };
};
