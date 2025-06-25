
import { useState } from 'react';
import { User, Phone, Mail, MapPin, Settings, MessageCircle, Globe, Store, Star, Heart, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeveloperContact } from '../DeveloperContact';

export const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'عميل الفهد',
    phone: '',
    email: '',
    address: ''
  });

  const handleUpdateInfo = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="talabat-gradient text-white p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold arabic-text">حسابي</h1>
          <p className="text-white/90 arabic-text">إدارة معلوماتك الشخصية</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-6">
        {/* معلومات المستخدم */}
        <Card className="talabat-card">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-3 arabic-text">
              <User className="w-6 h-6" />
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="name" className="arabic-text font-semibold">الاسم</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => handleUpdateInfo('name', e.target.value)}
                className="talabat-input text-right arabic-text"
                placeholder="أدخل اسمك"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="arabic-text font-semibold">رقم الهاتف</Label>
              <Input
                id="phone"
                value={userInfo.phone}
                onChange={(e) => handleUpdateInfo('phone', e.target.value)}
                className="talabat-input text-right"
                placeholder="01xxxxxxxxx"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="arabic-text font-semibold">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => handleUpdateInfo('email', e.target.value)}
                className="talabat-input text-right"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="arabic-text font-semibold">العنوان</Label>
              <Input
                id="address"
                value={userInfo.address}
                onChange={(e) => handleUpdateInfo('address', e.target.value)}
                className="talabat-input text-right arabic-text"
                placeholder="أدخل عنوانك"
              />
            </div>
            
            <Button className="talabat-button w-full">
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* إحصائيات المستخدم */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="talabat-card text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">4.8</p>
              <p className="text-sm text-gray-600 arabic-text">التقييم</p>
            </CardContent>
          </Card>
          
          <Card className="talabat-card text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">15</p>
              <p className="text-sm text-gray-600 arabic-text">طلب مكتمل</p>
            </CardContent>
          </Card>
          
          <Card className="talabat-card text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">8</p>
              <p className="text-sm text-gray-600 arabic-text">المفضلة</p>
            </CardContent>
          </Card>
          
          <Card className="talabat-card text-center">
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-sm text-gray-600 arabic-text">عضو منذ شهر</p>
            </CardContent>
          </Card>
        </div>

        {/* الإعدادات السريعة */}
        <Card className="talabat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 arabic-text">
              <Settings className="w-6 h-6 text-gray-600" />
              الإعدادات السريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="arabic-text font-medium">الإشعارات</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="arabic-text font-medium">تتبع الموقع</span>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات المطور */}
        <DeveloperContact />
      </div>
    </div>
  );
};
