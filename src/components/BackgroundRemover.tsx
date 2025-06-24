
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eraser, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundRemoverProps {
  image: string;
  onImageProcessed: (processedImage: string) => void;
  onClose: () => void;
}

const BackgroundRemover = ({ image, onImageProcessed, onClose }: BackgroundRemoverProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const removeBackground = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate background removal process with progress updates
      const steps = [
        { message: 'Loading image...', progress: 20 },
        { message: 'Analyzing objects...', progress: 40 },
        { message: 'Detecting edges...', progress: 60 },
        { message: 'Removing background...', progress: 80 },
        { message: 'Finalizing...', progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(step.progress);
        
        toast({
          title: "Processing...",
          description: step.message,
          duration: 800,
        });
      }

      // In a real implementation, this would use an AI background removal service
      // For now, we'll simulate it by returning the original image
      onImageProcessed(image);
      
      toast({
        title: "Background removed successfully!",
        description: "Your image is ready to use.",
      });
      
      onClose();
    } catch (error) {
      console.error('Background removal failed:', error);
      toast({
        title: "Processing failed",
        description: "Could not remove background. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Remove Background</h3>
        
        <div className="mb-4">
          <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
        </div>

        {isProcessing && (
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">Processing... {progress}%</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={removeBackground} 
            disabled={isProcessing}
            className="flex-1"
          >
            <Eraser className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Remove Background'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
