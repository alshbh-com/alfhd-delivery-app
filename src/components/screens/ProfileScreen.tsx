
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, Bell, Shield, HelpCircle, LogOut, Phone, Mail, MapPin, Clock, Edit, MessageCircle, Lock, Eye } from 'lucide-react';
import { DeveloperContact } from '../DeveloperContact';

export const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [showDeveloperContact, setShowDeveloperContact] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: 'محمد أحمد',
    email: 'user@example.com',
    phone: '+20 100 000 0000',
    address: 'القاهرة، مصر'
  });

  const profileItems = [
    {
      icon: User,
      title: 'الملف الشخصي',
      description: 'إدارة معلوماتك الشخصية',
      action: () => setShowProfileEdit(true)
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
      action: () => setShowPrivacy(true)
    },
    {
      icon: HelpCircle,
      title: 'المساعدة والدعم',
      description: 'الأسئلة الشائعة والدعم الفني',
      action: () => setShowFAQ(true)
    }
  ];

  const faqData = [
    {
      question: 'كيف يمكنني تتبع طلبي؟',
      answer: 'يمكنك تتبع طلبك من خلال قسم "طلباتي" في التطبيق، أو من خلال الرسائل التي ستصلك على واتساب.'
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل الدفع نقداً عند الاستلام، أو الدفع الإلكتروني من خلال فيزا أو ماستركارد.'
    },
    {
      question: 'كم تستغرق مدة التوصيل؟',
      answer: 'تتراوح مدة التوصيل بين 30-60 دقيقة حسب موقعك وزحام الطرق.'
    },
    {
      question: 'هل يمكنني إلغاء طلبي؟',
      answer: 'يمكن إلغاء الطلب خلال 10 دقائق من تأكيده، بعد ذلك لن يكون الإلغاء متاحاً.'
    },
    {
      question: 'كيف أحصل على نقاط الولاء؟',
      answer: 'تحصل على نقطة واحدة لكل جنيه تنفقه، ويمكن استبدال النقاط بخصومات أو منتجات مجانية.'
    }
  ];

  const privacyData = [
    {
      title: 'حماية البيانات',
      description: 'نحن نحمي بياناتك الشخصية وفقاً لأعلى معايير الأمان',
      icon: Lock
    },
    {
      title: 'الخصوصية',
      description: 'لا نشارك معلوماتك مع أطراف ثالثة بدون موافقتك',
      icon: Eye
    },
    {
      title: 'الأمان',
      description: 'جميع عمليات الدفع محمية بتشفير SSL',
      icon: Shield
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

      {/* Profile Edit Dialog */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              تعديل الملف الشخصي
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              />
            </div>
            <Button 
              onClick={() => setShowProfileEdit(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              حفظ التغييرات
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={showFAQ} onOpenChange={setShowFAQ}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              الأسئلة الشائعة والدعم الفني
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Technical Support */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">الدعم الفني المباشر</h3>
                </div>
                <p className="text-green-700 mb-3">تواصل معنا مباشرة عبر واتساب للحصول على دعم فوري</p>
                <Button 
                  onClick={() => window.open('https://wa.me/201204486263', '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  الدعم الفني عبر واتساب
                </Button>
              </CardContent>
            </Card>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              الخصوصية والأمان
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {privacyData.map((item, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">إعدادات إضافية</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">تفعيل المصادقة الثنائية</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">إخفاء النشاط</span>
                  <Switch />
                </div>
                <Button
                  onClick={() => window.open('https://www.termsfeed.com/live/028a0d53-8653-4f56-b2c8-a7be95c19210', '_blank')}
                  variant="outline"
                  className="w-full justify-start p-3 h-auto"
                >
                  <Shield className="w-4 h-4 ml-2" />
                  سياسة الخصوصية
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
