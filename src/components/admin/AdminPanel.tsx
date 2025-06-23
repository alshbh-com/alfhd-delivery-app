
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package, Tag, Gift, MapPin, Settings, Power } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const adminSections = [
    { id: 'categories', icon: Tag, title: 'إدارة الأقسام', description: 'إضافة وتعديل الأقسام الرئيسية والفرعية' },
    { id: 'products', icon: Package, title: 'إدارة المنتجات', description: 'إضافة وتعديل المنتجات' },
    { id: 'offers', icon: Gift, title: 'إدارة العروض', description: 'إضافة وتعديل العروض الترويجية' },
    { id: 'cities', icon: MapPin, title: 'إدارة المناطق', description: 'إدارة المناطق وأسعار التوصيل' },
    { id: 'settings', icon: Settings, title: 'الإعدادات العامة', description: 'إعدادات التطبيق العامة' },
    { id: 'app-control', icon: Power, title: 'التحكم في التطبيق', description: 'فتح/إغلاق التطبيق' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">لوحة الإدارة</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveSection(section.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* سيتم إضافة المكونات الفرعية لكل قسم لاحقاً */}
      {activeSection && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              قسم {adminSections.find(s => s.id === activeSection)?.title} سيتم تطويره في الخطوة التالية
            </p>
            <Button
              onClick={() => setActiveSection(null)}
              variant="outline"
              className="w-full mt-4"
            >
              العودة للقائمة الرئيسية
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
