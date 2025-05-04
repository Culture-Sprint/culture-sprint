
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { getGravatarUrl, getUserInitials } from "@/utils/avatarUtils";
import GuestUserButton from "./user-card/GuestUserButton";
import CollapsedUserCard from "./user-card/CollapsedUserCard";
import ExpandedUserCard from "./user-card/ExpandedUserCard";
import { getUserDisplayName } from "./user-card/userCardUtils";

export const UserCard = ({ collapsed }: { collapsed: boolean }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { roles, isSuperUser, isAdmin, isDemo } = useUserRole();
  const [profileData, setProfileData] = useState<{ full_name?: string; username?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }
        
        setProfileData(data);
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
      }
    };
    
    fetchProfileData();

    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user?.id}` 
      }, () => {
        console.log('Profile updated, refreshing data');
        fetchProfileData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) {
    return <GuestUserButton collapsed={collapsed} />;
  }

  const goToProfile = () => {
    navigate("/profile");
  };
  
  const avatarUrl = profileData?.avatar_url || (user.email ? getGravatarUrl(user.email) : null);
  
  const getUserInitial = () => {
    if (profileData?.full_name) {
      return getUserInitials(profileData.full_name);
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };
  
  const getDisplayName = () => {
    // Pass user as an object that matches the expected type
    return getUserDisplayName(profileData, {
      email: user.email,
      user_metadata: user.user_metadata
    });
  };

  if (collapsed) {
    return (
      <CollapsedUserCard 
        user={user}
        avatarUrl={avatarUrl}
        getUserInitial={getUserInitial}
        goToProfile={goToProfile}
        isAdmin={isAdmin}
        isSuperUser={isSuperUser}
        isDemo={isDemo}
        signOut={signOut}
      />
    );
  }

  return (
    <ExpandedUserCard 
      user={user}
      avatarUrl={avatarUrl}
      getUserInitial={getUserInitial}
      getDisplayName={getDisplayName}
      isAdmin={isAdmin}
      isSuperUser={isSuperUser}
      isDemo={isDemo}
      goToProfile={goToProfile}
      signOut={signOut}
    />
  );
};
