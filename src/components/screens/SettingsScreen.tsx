
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, BarChart3, Users } from 'lucide-react';
import { AdminPanel } from '../admin/AdminPanel';
import { StatsPanel } from '../admin/StatsPanel';
import { PasswordDialog } from '../admin/PasswordDialog';

export const SettingsScreen = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordType, setPasswordType] = useState<'admin' | 'stats'>('admin');

  const handleAdminAccess = () => {
    setPasswordType('admin');
    setShowPasswordDialog(true);
  };

  const handleStatsAccess = () => {
    setPasswordType('stats');
    setShowPasswordDialog(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordDialog(false);
    if (passwordType === 'admin') {
      setShowAdminPanel(true);
    } else {
      setShowStatsPanel(true);
    }
  };

  if (showAdminPanel) {
    return <AdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  if (showStatsPanel) {
    return <StatsPanel onBack={() => setShowStatsPanel(false)} />;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">الإعدادات</h1>

      <div className="space-y-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleAdminAccess}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">الإدارة</h3>
                <p className="text-gray-600">إدارة المنتجات والأقسام والعروض</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStatsAccess}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">الإحصائيات</h3>
                <p className="text-gray-600">عرض الطلبات والأرباح</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">معلومات التطبيق</h3>
                <p className="text-gray-600">متجر الفهد للتوصيل</p>
                <p className="text-sm text-gray-500 mt-1">الإصدار 1.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
        type={passwordType}
      />
    </div>
  );
};
