import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Gift, Star, TrendingUp, Users, Award } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoyaltyPanelProps {
  userId?: string;
}

interface LoyaltyData {
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_orders: number;
  total_spent: number;
}

const LEVEL_REQUIREMENTS = {
  bronze: { orders: 0, spent: 0, color: 'bg-orange-500', icon: '🥉' },
  silver: { orders: 10, spent: 500, color: 'bg-gray-400', icon: '🥈' },
  gold: { orders: 25, spent: 1500, color: 'bg-yellow-500', icon: '🥇' },
  platinum: { orders: 50, spent: 3000, color: 'bg-purple-500', icon: '💎' }
};

const POINT_REWARDS = [
  { points: 100, reward: 'خصم 10 ر.س', type: 'discount', value: 10 },
  { points: 250, reward: 'توصيل مجاني', type: 'free_delivery', value: 0 },
  { points: 500, reward: 'خصم 25 ر.س', type: 'discount', value: 25 },
  { points: 1000, reward: 'وجبة مجانية', type: 'free_meal', value: 50 }
];

export const LoyaltyPanel = ({ userId }: LoyaltyPanelProps) => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadLoyaltyData();
      loadPointsHistory();
    }
  }, [userId]);

  const loadLoyaltyData = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setLoyaltyData(data as LoyaltyData);
      } else {
        // إنشاء سجل ولاء جديد للمستخدم
        const { data: newLoyalty } = await supabase
          .from('loyalty_points')
          .insert([{
            user_id: userId,
            points: 0,
            level: 'bronze',
            total_orders: 0,
            total_spent: 0
          }])
          .select()
          .single();

        if (newLoyalty) {
          setLoyaltyData(newLoyalty as LoyaltyData);
        }
      }
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPointsHistory = async () => {
    try {
      const { data } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setPointsHistory(data || []);
    } catch (error) {
      console.error('Error loading points history:', error);
    }
  };

  const redeemReward = async (reward: typeof POINT_REWARDS[0]) => {
    if (!loyaltyData || loyaltyData.points < reward.points) {
      toast({
        title: "نقاط غير كافية",
        description: `تحتاج إلى ${reward.points} نقطة لاستبدال هذه المكافأة`,
        variant: "destructive",
      });
      return;
    }

    try {
      // خصم النقاط
      const newPoints = loyaltyData.points - reward.points;
      
      const { error: updateError } = await supabase
        .from('loyalty_points')
        .update({ points: newPoints })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // إضافة سجل في تاريخ النقاط
      const { error: historyError } = await supabase
        .from('points_history')
        .insert([{
          user_id: userId,
          points: -reward.points,
          type: 'redeemed',
          description: `استبدال: ${reward.reward}`
        }]);

      if (historyError) throw historyError;

      // تحديث البيانات المحلية
      setLoyaltyData(prev => prev ? { ...prev, points: newPoints } : null);
      
      toast({
        title: "تم الاستبدال بنجاح! 🎉",
        description: `تم استبدال ${reward.reward}`,
      });

      // إعادة تحميل التاريخ
      loadPointsHistory();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "خطأ في الاستبدال",
        description: "حدث خطأ أثناء استبدال المكافأة",
        variant: "destructive",
      });
    }
  };

  const getNextLevel = (currentLevel: string) => {
    const levels = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const getProgressToNextLevel = () => {
    if (!loyaltyData) return 0;
    
    const nextLevel = getNextLevel(loyaltyData.level);
    if (!nextLevel) return 100;

    const nextRequirement = LEVEL_REQUIREMENTS[nextLevel as keyof typeof LEVEL_REQUIREMENTS];
    const currentProgress = Math.min(loyaltyData.total_orders, loyaltyData.total_spent / 10);
    const requiredProgress = Math.min(nextRequirement.orders, nextRequirement.spent / 10);
    
    return Math.min((currentProgress / requiredProgress) * 100, 100);
  };

  if (!userId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 arabic-text mb-2">
            انضم لبرنامج الولاء
          </h3>
          <p className="text-gray-500 arabic-text">
            سجل دخولك لتجمع النقاط وتحصل على مكافآت حصرية
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyData) return null;

  const nextLevel = getNextLevel(loyaltyData.level);
  const progressPercent = getProgressToNextLevel();

  return (
    <div className="space-y-6">
      {/* مستوى الولاء الحالي */}
      <Card className={`${LEVEL_REQUIREMENTS[loyaltyData.level].color} text-white`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 arabic-text">
            <Crown className="w-6 h-6" />
            مستوى الولاء: {loyaltyData.level.toUpperCase()}
            <span className="text-2xl">{LEVEL_REQUIREMENTS[loyaltyData.level].icon}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{loyaltyData.points}</div>
              <div className="text-sm opacity-90">نقطة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{loyaltyData.total_orders}</div>
              <div className="text-sm opacity-90">طلب</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{loyaltyData.total_spent}</div>
              <div className="text-sm opacity-90">ر.س</div>
            </div>
          </div>

          {nextLevel && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>التقدم للمستوى التالي</span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercent} className="bg-white/20" />
              <p className="text-xs mt-2 opacity-90">
                المستوى التالي: {nextLevel.toUpperCase()} {LEVEL_REQUIREMENTS[nextLevel as keyof typeof LEVEL_REQUIREMENTS].icon}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* مكافآت قابلة للاستبدال */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 arabic-text">
            <Gift className="w-5 h-5 text-primary" />
            مكافآت متاحة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {POINT_REWARDS.map((reward, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium arabic-text">{reward.reward}</span>
                  <Badge variant={loyaltyData.points >= reward.points ? "default" : "secondary"}>
                    {reward.points} نقطة
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant={loyaltyData.points >= reward.points ? "default" : "outline"}
                  disabled={loyaltyData.points < reward.points}
                  onClick={() => redeemReward(reward)}
                  className="w-full text-xs arabic-text"
                >
                  {loyaltyData.points >= reward.points ? 'استبدل الآن' : 'نقاط غير كافية'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تاريخ النقاط */}
      {pointsHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 arabic-text">
              <TrendingUp className="w-5 h-5 text-green-500" />
              تاريخ النقاط
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {pointsHistory.map((history) => (
                <div key={history.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm font-medium arabic-text">{history.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(history.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className={`font-bold text-sm ${history.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {history.points > 0 ? '+' : ''}{history.points}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* مزايا المستوى */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 arabic-text">
            <Award className="w-5 h-5 text-yellow-500" />
            مزايا مستواك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loyaltyData.level === 'bronze' && (
              <div className="text-sm arabic-text">
                • 1 نقطة لكل 10 ر.س من المشتريات
              </div>
            )}
            {['silver', 'gold', 'platinum'].includes(loyaltyData.level) && (
              <>
                <div className="text-sm arabic-text">• 2 نقطة لكل 10 ر.س من المشتريات</div>
                <div className="text-sm arabic-text">• خصم 5% على جميع الطلبات</div>
              </>
            )}
            {['gold', 'platinum'].includes(loyaltyData.level) && (
              <>
                <div className="text-sm arabic-text">• توصيل مجاني مرة واحدة شهرياً</div>
                <div className="text-sm arabic-text">• إشعارات مبكرة للعروض الخاصة</div>
              </>
            )}
            {loyaltyData.level === 'platinum' && (
              <>
                <div className="text-sm arabic-text">• خدمة عملاء مخصصة</div>
                <div className="text-sm arabic-text">• هدايا حصرية في المناسبات</div>
                <div className="text-sm arabic-text">• وصول مبكر للمطاعم الجديدة</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};