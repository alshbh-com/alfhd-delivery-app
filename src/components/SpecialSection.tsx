import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, Send, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SpecialSection = () => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setImages(prev => [...prev, ...newImages]);
      toast({
        title: "تم رفع الصور بنجاح",
        description: `تم إضافة ${newImages.length} صورة`
      });
    }
  };

  const handleCameraCapture = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setImages(prev => [...prev, ...newImages]);
      toast({
        title: "تم التقاط الصور بنجاح",
        description: `تم إضافة ${newImages.length} صورة`
      });
    }
  };

  const handleSubmit = () => {
    if (!message.trim() && images.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة رسالة أو إضافة صور",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Special request:', { message, images });
    
    toast({
      title: "تم إرسال طلبك المميز!",
      description: "سنتواصل معك قريباً"
    });
    
    // Reset form
    setMessage('');
    setImages([]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="special-card border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          <Star className="w-6 h-6 text-purple-600" />
          القسم المميز
          <Star className="w-6 h-6 text-purple-600" />
        </CardTitle>
        <p className="text-gray-600 arabic-text">اطلب أي شيء تحتاجه وسنوفره لك</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Message Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 arabic-text">
            اكتب طلبك المميز
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="مثال: أريد كيك عيد ميلاد مكتوب عليه اسم أحمد..."
            className="min-h-24 resize-none arabic-text border-purple-200 focus:border-purple-500"
            dir="rtl"
          />
        </div>

        {/* Image Upload Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            variant="outline"
            className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
          >
            <Camera className="w-6 h-6 text-purple-600" />
            <span className="text-sm arabic-text">التقط صورة</span>
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"  
            className="h-20 flex-col gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
          >
            <Upload className="w-6 h-6 text-purple-600" />
            <span className="text-sm arabic-text">رفع صورة</span>
          </Button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e.target.files)}
          className="hidden"
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => handleCameraCapture(e.target.files)}
          className="hidden"
        />

        {/* Preview Images */}
        {images.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 arabic-text">
              الصور المرفقة ({images.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-purple-200"
                  />
                  <Button
                    onClick={() => removeImage(index)}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
        >
          <Send className="w-4 h-4 ml-2" />
          إرسال الطلب المميز
        </Button>
      </CardContent>
    </Card>
  );
};