import React, { useState } from 'react';
import { FloomHeader } from '@/components/FloomHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Moon, Sun, Crown, Bell, Shield, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  // Mock premium status - in real app this would come from user data
  const isPremium = false;

  return (
    <div className="min-h-screen bg-background">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="rounded-full px-4 py-2 border-border/50 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              back
            </Button>
            <div></div> {/* Spacer for alignment */}
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your Floom experience
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                  {!isPremium && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-700 border-amber-200">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <Label htmlFor="theme-light">Light Mode</Label>
                  </div>
                  <Switch
                    id="theme-light"
                    checked={theme === 'light'}
                    onCheckedChange={() => setTheme('light')}
                    disabled={!isPremium}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4" />
                    <Label htmlFor="theme-dark">Dark Mode</Label>
                  </div>
                  <Switch
                    id="theme-dark"
                    checked={theme === 'dark'}
                    onCheckedChange={() => setTheme('dark')}
                    disabled={!isPremium}
                  />
                </div>

                {!isPremium && (
                  <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-700">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <Crown className="w-4 h-4 inline mr-1" />
                      Upgrade to Premium to customize themes and unlock exclusive features
                    </p>
                    <Button size="sm" className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                      Upgrade Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Space Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when spaces you're interested in go live</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mentions">Mentions & Replies</Label>
                    <p className="text-sm text-muted-foreground">When someone mentions or replies to you</p>
                  </div>
                  <Switch id="mentions" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve Floom with anonymous usage data</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={dataSharing}
                    onCheckedChange={setDataSharing}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Blocked Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Data Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account */}
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Email Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Connected Accounts
                  </Button>
                </div>
                
                <Separator />
                
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* Premium Features Preview */}
            {!isPremium && (
              <Card className="border-gradient-to-r from-amber-200 to-amber-300 dark:from-amber-700 dark:to-amber-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-200">
                    <Crown className="w-5 h-5" />
                    Premium Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Custom themes (Light/Dark modes)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Advanced space analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Exclusive premium badges
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Extended space recording
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;