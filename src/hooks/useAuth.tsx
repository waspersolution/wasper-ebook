
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface CompanyBranchContext {
  companyId: string | null;
  companyName: string | null;
  branchId: string | null;
  branchName: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  companyBranch: CompanyBranchContext;
  updateCompanyBranch: (data: Partial<CompanyBranchContext>) => void;
  clearCompanyBranchContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyBranch, setCompanyBranch] = useState<CompanyBranchContext>({
    companyId: null,
    companyName: null,
    branchId: null,
    branchName: null
  });

  useEffect(() => {
    // Initialize companyBranch from localStorage
    const storedCompanyId = localStorage.getItem('selectedCompanyId');
    const storedCompanyName = localStorage.getItem('selectedCompanyName');
    const storedBranchId = localStorage.getItem('selectedBranchId');
    const storedBranchName = localStorage.getItem('selectedBranchName');
    
    if (storedCompanyId || storedBranchId) {
      setCompanyBranch({
        companyId: storedCompanyId,
        companyName: storedCompanyName,
        branchId: storedBranchId,
        branchName: storedBranchName
      });
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        // If user signs out, clear company and branch selection
        if (event === 'SIGNED_OUT') {
          clearCompanyBranchContextInternal();
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    clearCompanyBranchContextInternal();
    await supabase.auth.signOut();
  };

  const clearCompanyBranchContextInternal = () => {
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedCompanyName');
    localStorage.removeItem('selectedBranchId');
    localStorage.removeItem('selectedBranchName');
    
    setCompanyBranch({
      companyId: null,
      companyName: null,
      branchId: null,
      branchName: null
    });
  };

  const clearCompanyBranchContext = () => {
    clearCompanyBranchContextInternal();
  };

  const updateCompanyBranch = (data: Partial<CompanyBranchContext>) => {
    setCompanyBranch(prev => {
      const updated = { ...prev, ...data };
      
      // Update localStorage with new values
      if (data.companyId !== undefined) {
        if (data.companyId) {
          localStorage.setItem('selectedCompanyId', data.companyId);
        } else {
          localStorage.removeItem('selectedCompanyId');
        }
      }
      
      if (data.companyName !== undefined) {
        if (data.companyName) {
          localStorage.setItem('selectedCompanyName', data.companyName);
        } else {
          localStorage.removeItem('selectedCompanyName');
        }
      }
      
      if (data.branchId !== undefined) {
        if (data.branchId) {
          localStorage.setItem('selectedBranchId', data.branchId);
        } else {
          localStorage.removeItem('selectedBranchId');
        }
      }
      
      if (data.branchName !== undefined) {
        if (data.branchName) {
          localStorage.setItem('selectedBranchName', data.branchName);
        } else {
          localStorage.removeItem('selectedBranchName');
        }
      }
      
      return updated;
    });
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    companyBranch,
    updateCompanyBranch,
    clearCompanyBranchContext
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
