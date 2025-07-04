
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AppSettingsProps {
  onBack: () => void;
}

export const AppSettings = ({ onBack }: AppSettingsProps) => {
  const [settings, setSettings] = useState({
    app_open: true,
    welcome_message: '',
    welcome_image: '',
    whatsapp_number: '',
    admin_password: '',
    stats_password: '',
    developer_whatsapp: '',
    developer_website: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('*');

      if (data) {
        const settingsObj: any = {};
        data.forEach(setting => {
          if (setting.key === 'app_open') {
            settingsObj[setting.key] = setting.value === 'true';
          } else {
            settingsObj[setting.key] = setting.value || '';
          }
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value.toString(),
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        await supabase
          .from('app_settings')
          .upsert(update, { onConflict: 'key' });
      }

      toast({ title: "تم حفظ الإعدادات بنجاح" });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: "حدث خطأ في الحفظ", variant: "destructive" });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prev => ({ ...prev, welcome_image: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات العامة</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* إشعار تحذيري */}
          <Alert className="bg-amber-50 border-amber-200 shadow-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 font-medium">
              <div className="space-y-2">
                <p className="font-bold text-lg">⚠️ تنويه مهم</p>
                <p className="leading-relaxed">
                  نود التأكيد على أن شركتنا تحمل اسم <strong>"طلبيات"</strong> وليس "طلبات". 
                  نحن شركة مستقلة تماماً ولسنا مرتبطين بأي شركة أخرى تحمل أسماء مشابهة.
                </p>
                <p className="leading-relaxed">
                  شركة "طلبات" هي شركة محترمة ولها كامل التقدير والاحترام، ونحن نؤكد أننا 
                  لسنا مسؤولين عن أي التباس أو خلط قد يحدث بين الشركتين.
                </p>
                <p className="font-semibold text-amber-900">
                  يرجى التأكد من اسم الشركة عند التعامل معنا تجنباً لأي سوء فهم.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <Label htmlFor="app-status">حالة التطبيق</Label>
            <div className="flex items-center gap-2">
              <span>مغلق</span>
              <Switch
                id="app-status"
                checked={settings.app_open}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, app_open: checked }))}
              />
              <span>مفتوح</span>
            </div>
          </div>

          <div>
            <Label htmlFor="welcome-message">رسالة الترحيب</Label>
            <Textarea
              id="welcome-message"
              value={settings.welcome_message}
              onChange={(e) => setSettings(prev => ({ ...prev, welcome_message: e.target.value }))}
              placeholder="أدخل رسالة الترحيب"
            />
          </div>

          <div>
            <Label htmlFor="welcome-image">صورة الترحيب</Label>
            <Input
              id="welcome-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {settings.welcome_image && (
              <img src={settings.welcome_image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
            )}
          </div>

          <div>
            <Label htmlFor="whatsapp">رقم واتساب الطلبات</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
              placeholder="201024713976"
            />
          </div>

          <div>
            <Label htmlFor="admin-password">كلمة مرور الإدارة</Label>
            <Input
              id="admin-password"
              type="password"
              value={settings.admin_password}
              onChange={(e) => setSettings(prev => ({ ...prev, admin_password: e.target.value }))}
              placeholder="01278006248"
            />
          </div>

          <div>
            <Label htmlFor="stats-password">كلمة مرور الإحصائيات</Label>
            <Input
              id="stats-password"
              type="password"
              value={settings.stats_password}
              onChange={(e) => setSettings(prev => ({ ...prev, stats_password: e.target.value }))}
              placeholder="01204486263"
            />
          </div>

          <div>
            <Label htmlFor="dev-whatsapp">رقم واتساب المطور</Label>
            <Input
              id="dev-whatsapp"
              value={settings.developer_whatsapp}
              onChange={(e) => setSettings(prev => ({ ...prev, developer_whatsapp: e.target.value }))}
              placeholder="201204486263"
            />
          </div>

          <div>
            <Label htmlFor="dev-website">موقع المطور</Label>
            <Input
              id="dev-website"
              value={settings.developer_website}
              onChange={(e) => setSettings(prev => ({ ...prev, developer_website: e.target.value }))}
              placeholder="alshbh.netlify.app"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
