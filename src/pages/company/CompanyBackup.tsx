import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Upload, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: string;
  name: string;
}

interface BackupRecord {
  id: number;
  name: string;
  timestamp: string;
  size: string;
  status: 'completed' | 'scheduled' | 'failed';
}

const sampleBackups: BackupRecord[] = [
  { id: 1, name: 'Daily Backup', timestamp: '2025-04-12T08:00:00Z', size: '2.3MB', status: 'completed' },
  { id: 2, name: 'Weekly Backup', timestamp: '2025-04-05T01:00:00Z', size: '5.7MB', status: 'completed' },
  { id: 3, name: 'Monthly Backup', timestamp: '2025-04-01T02:00:00Z', size: '12.1MB', status: 'completed' },
  { id: 4, name: 'Upcoming Backup', timestamp: '2025-04-13T08:00:00Z', size: '---', status: 'scheduled' },
];

const CompanyBackup = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState<BackupRecord[]>(sampleBackups);
  const [autoBackup, setAutoBackup] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', companyId)
          .single();

        if (error) throw error;

        setCompany(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load company data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, toast]);

  const handleBackupNow = () => {
    toast({
      title: 'Backup started',
      description: 'Your company data backup has been initiated. This may take a few moments.',
    });
    
    // Simulate backup process
    setTimeout(() => {
      const newBackup = {
        id: Date.now(),
        name: 'Manual Backup',
        timestamp: new Date().toISOString(),
        size: '3.2MB',
        status: 'completed' as const
      };
      
      setBackups([newBackup, ...backups]);
      
      toast({
        title: 'Backup completed',
        description: 'Your company data has been successfully backed up.',
      });
    }, 3000);
  };

  const handleRestore = (backupId: number) => {
    toast({
      title: 'Restore started',
      description: 'Restoring company data from the selected backup. This may take a few moments.',
    });
    
    // Simulate restore process
    setTimeout(() => {
      toast({
        title: 'Restore completed',
        description: 'Your company data has been successfully restored.',
      });
    }, 3000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading backup management...</p>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Company not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{company.name} - Backup & Restore</h1>
          <p className="text-muted-foreground">
            Manage data backup and restore operations for your company.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Manual Backup</CardTitle>
              <CardDescription>Create an on-demand backup of your company data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Creating a backup will capture all your current data including transactions, 
                inventory, and user information.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBackupNow} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Scheduled Backups</CardTitle>
              <CardDescription>Configure automatic backup schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <span className="text-sm text-muted-foreground">
                      Enable daily automated backups
                    </span>
                  </div>
                  <Switch 
                    id="auto-backup" 
                    checked={autoBackup} 
                    onCheckedChange={setAutoBackup} 
                  />
                </div>
                
                {autoBackup && (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Scheduled daily at 3:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Weekly retention policy</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={!autoBackup}>
                Configure Schedule
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Restore Data</CardTitle>
              <CardDescription>Roll back to a previous backup</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Restoring will replace all current data with the selected backup. 
                This action cannot be undone.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Select Backup to Restore
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>List of all backups for {company.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {backup.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{backup.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(backup.timestamp).toLocaleString()} • {backup.size}
                      </div>
                    </div>
                  </div>
                  {backup.status === 'completed' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleRestore(backup.id)}>
                        Restore
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {backup.status === 'scheduled' && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Scheduled
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyBackup;
