
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'admin' | 'stats';
}

export const PasswordDialog = ({ isOpen, onClose, onSuccess, type }: PasswordDialogProps) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const expectedPasswords = {
    admin: '01278006248',
    stats: '01204486263'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === expectedPasswords[type]) {
      onSuccess();
      setPassword('');
    } else {
      toast({
        title: "كلمة مرور خاطئة",
        description: "يرجى إدخال كلمة المرور الصحيحة",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">
            {type === 'admin' ? 'دخول الإدارة' : 'دخول الإحصائيات'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="text-right"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              دخول
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
