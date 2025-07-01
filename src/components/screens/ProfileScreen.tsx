
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, HelpCircle, LogOut, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { DeveloperContact } from '../DeveloperContact';

export const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [showDeveloperContact, setShowDeveloperContact] = useState(false);

  const profileItems = [
    {
      icon: User,
      title: 'الملف الشخصي',
      description: 'إدارة معلوماتك الشخصية',
      action: () => console.log('Profile clicked')
    },
    {
      icon: Bell,
      title: 'الإشعارات',
      description: 'إدارة إعدادات الإشعارات',
      action: () => setNotifications(!notifications),
      hasSwitch: true,
      switchValue: notifications
    },
    {
      icon: Shield,
      title: 'الخصوصية والأمان',
      description: 'إعدادات الحساب والخصوصية',
      action: () => console.log('Privacy clicked')
    },
    {
      icon: HelpCircle,
      title: 'المساعدة والدعم',
      description: 'الأسئلة الشائعة والدعم الفني',
      action: () => console.log('Help clicked')
    }
  ];

  const developerInfo = [
    {
      icon: Phone,
      title: 'رقم الهاتف',
      value: '+20 120 448 6263',
      action: () => window.open('tel:+201204486263')
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'alshbhh@outlook.com',
      action: () => window.open('mailto:alshbhh@outlook.com')
    },
    {
      icon: MapPin,
      title: 'الموقع',
      value: 'القاهرة، مصر',
      action: () => console.log('Location clicked')
    }
  ];

  if (showDeveloperContact) {
    return <DeveloperContact onBack={() => setShowDeveloperContact(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <User className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">مرحباً بك</h1>
        <p className="text-gray-600">إدارة حسابك وإعداداتك</p>
      </div>

      {/* Profile Items */}
      <div className="space-y-4 mb-8">
        {profileItems.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                
                {item.hasSwitch ? (
                  <Switch
                    checked={item.switchValue}
                    onCheckedChange={() => item.action()}
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={item.action}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <span className="sr-only">فتح {item.title}</span>
                    →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Developer Contact Section */}
      <Card className="shadow-md mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Phone className="w-5 h-5 ml-2 text-blue-600" />
            معلومات المطور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {developerInfo.map((info, index) => (
            <div key={index}>
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto hover:bg-blue-50"
                onClick={info.action}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <info.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{info.title}</div>
                    <div className="text-sm text-gray-600">{info.value}</div>
                  </div>
                </div>
              </Button>
              {index < developerInfo.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
          
          <Button
            onClick={() => setShowDeveloperContact(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white mt-4"
          >
            <HelpCircle className="w-4 h-4 ml-2" />
            المزيد من معلومات التواصل
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-md">
        <CardContent className="p-4 text-center">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">إصدار التطبيق: 1.0.0</p>
          <p className="text-xs text-gray-500">آخر تحديث: يناير 2024</p>
        </CardContent>
      </Card>
    </div>
  );
};
