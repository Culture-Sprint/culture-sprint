
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { UpgradeCode } from "../types/upgrade-code";

interface CodesTableProps {
  codes: UpgradeCode[];
}

interface UserEmail {
  id: string;
  email: string;
}

const CodesTable = ({ codes }: CodesTableProps) => {
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUserEmails = async () => {
      const { data, error } = await supabase.rpc('get_user_emails');
      
      if (!error && Array.isArray(data)) {
        const emailMap = (data as UserEmail[]).reduce((acc, { id, email }) => {
          acc[id] = email;
          return acc;
        }, {} as Record<string, string>);
        setUserEmails(emailMap);
      }
    };

    if (codes.some(code => code.used_by)) {
      fetchUserEmails();
    }
  }, [codes]);

  return (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Expires</th>
            <th className="p-2 text-left">Used By</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id} className="border-b">
              <td className="p-2">{code.code}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  code.is_used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {code.is_used ? 'Used' : 'Available'}
                </span>
              </td>
              <td className="p-2">{format(new Date(code.expires_at), "PPP")}</td>
              <td className="p-2">
                {code.used_by ? (userEmails[code.used_by] || '-') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CodesTable;
