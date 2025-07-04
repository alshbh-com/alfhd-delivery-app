import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Send, Image, Calendar, Users, Target, Volume2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  sound: string;
  target_audience: string;
  target_criteria: any;
  sent_at?: string;
  status: string;
  scheduled_for?: string;
  sent_count: number;
  created_at: string;
}

interface NotificationManagerProps {
  onBack: () => void;
}

export const NotificationManager = ({ onBack }: NotificationManagerProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image_url: '',
    sound: 'default',
    target_audience: 'all',
    target_criteria: {},
    scheduled_for: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الإشعارات',
        variant: 'destructive'
      });
    }
  };

  const createNotification = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...formData,
          scheduled_for: formData.scheduled_for || null,
          created_by: 'admin'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'تم بنجاح',
        description: 'تم إنشاء الإشعار بنجاح',
      });

      setFormData({
        title: '',
        message: '',
        image_url: '',
        sound: 'default',
        target_audience: 'all',
        target_criteria: {},
        scheduled_for: ''
      });
      setShowCreateDialog(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء الإشعار',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async (notificationId: string) => {
    setIsLoading(true);
    try {
      console.log('Sending notification with ID:', notificationId);
      
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: { notificationId }
      });

      console.log('FCM Response:', data);
      console.log('FCM Error:', error);

      if (error) throw error;

      toast({
        title: 'تم الإرسال',
        description: `تم إرسال الإشعار إلى ${data.sentCount} مستخدم`,
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'خطأ',
        description: `فشل في إرسال الإشعار: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500">تم الإرسال</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">مجدول</Badge>;
      default:
        return <Badge variant="secondary">مسودة</Badge>;
    }
  };

  const getAudienceText = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'جميع المستخدمين';
      case 'city':
        return 'مدينة محددة';
      case 'specific_users':
        return 'مستخدمون محددون';
      default:
        return audience;
    }
  };

  const soundOptions = [
    { value: 'default', label: 'الافتراضي' },
    { value: 'chips_crunch', label: 'قرمشة شيبسي' },
    { value: 'notification', label: 'تنبيه عادي' },
    { value: 'success', label: 'نجاح' },
    { value: 'alert', label: 'تحذير' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">إدارة الإشعارات</h1>
            <p className="text-gray-600">إرسال إشعارات للمستخدمين</p>
          </div>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Bell className="w-4 h-4 ml-2" />
              إنشاء إشعار جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إنشاء إشعار جديد
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان الإشعار</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="اكتب عنوان الإشعار..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="sound">نغمة الإشعار</Label>
                  <Select
                    value={formData.sound}
                    onValueChange={(value) => setFormData({...formData, sound: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {soundOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">نص الرسالة</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="اكتب نص الرسالة..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image_url">رابط الصورة</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_audience">الجمهور المستهدف</Label>
                  <Select
                    value={formData.target_audience}
                    onValueChange={(value) => setFormData({...formData, target_audience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          جميع المستخدمين
                        </div>
                      </SelectItem>
                      <SelectItem value="city">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          مدينة محددة
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduled_for">جدولة الإرسال (اختياري)</Label>
                  <Input
                    id="scheduled_for"
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData({...formData, scheduled_for: e.target.value})}
                  />
                </div>
              </div>

              {formData.image_url && (
                <div className="border rounded-lg p-4">
                  <Label>معاينة الصورة:</Label>
                  <img 
                    src={formData.image_url} 
                    alt="معاينة" 
                    className="w-full h-32 object-cover rounded mt-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={createNotification}
                  disabled={!formData.title || !formData.message || isLoading}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 ml-2" />
                  {formData.scheduled_for ? 'جدولة الإشعار' : 'إنشاء وإرسال'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">تم إرساله</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">مجدول</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">إجمالي المرسل إليهم</p>
                <p className="text-2xl font-bold">
                  {notifications.reduce((acc, n) => acc + n.sent_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الإشعارات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {getStatusBadge(notification.status)}
                      {notification.sound !== 'default' && (
                        <Badge variant="outline" className="text-xs">
                          <Volume2 className="w-3 h-3 ml-1" />
                          {soundOptions.find(s => s.value === notification.sound)?.label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>الجمهور: {getAudienceText(notification.target_audience)}</span>
                      {notification.sent_count > 0 && (
                        <span>تم الإرسال إلى: {notification.sent_count} مستخدم</span>
                      )}
                      {notification.sent_at && (
                        <span>تاريخ الإرسال: {new Date(notification.sent_at).toLocaleDateString('ar-EG')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notification.image_url && (
                      <img 
                        src={notification.image_url} 
                        alt="صورة الإشعار" 
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    
                    {notification.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => sendNotification(notification.id)}
                        disabled={isLoading}
                      >
                        <Send className="w-4 h-4 ml-1" />
                        إرسال
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد إشعارات حتى الآن</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};