
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image as ImageIcon, FileSignature, Award, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BackgroundRemover from './BackgroundRemover';

interface AssetUploaderProps {
  onAssetsUpload: (assets: { signatures: string[]; stamps: string[]; logos: string[] }) => void;
  currentAssets: { signatures: string[]; stamps: string[]; logos: string[] };
}

const AssetUploader = ({ onAssetsUpload, currentAssets }: AssetUploaderProps) => {
  const [assets, setAssets] = useState(currentAssets);
  const [showBackgroundRemover, setShowBackgroundRemover] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [processingType, setProcessingType] = useState<'signatures' | 'stamps' | 'logos'>('signatures');
  
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (
    files: FileList | null, 
    type: 'signatures' | 'stamps' | 'logos'
  ) => {
    if (!files) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(results => {
      const newAssets = {
        ...assets,
        [type]: [...assets[type], ...results]
      };
      setAssets(newAssets);
      onAssetsUpload(newAssets);
      
      toast({
        title: "Assets uploaded successfully",
        description: `${results.length} ${type} uploaded`,
      });
    });
  };

  const removeAsset = (type: 'signatures' | 'stamps' | 'logos', index: number) => {
    const newAssets = {
      ...assets,
      [type]: assets[type].filter((_, i) => i !== index)
    };
    setAssets(newAssets);
    onAssetsUpload(newAssets);
  };

  const processImage = (image: string, type: 'signatures' | 'stamps' | 'logos') => {
    setSelectedImage(image);
    setProcessingType(type);
    setShowBackgroundRemover(true);
  };

  const handleImageProcessed = (processedImage: string) => {
    const imageIndex = assets[processingType].indexOf(selectedImage);
    if (imageIndex !== -1) {
      const newAssets = {
        ...assets,
        [processingType]: assets[processingType].map((img, i) => 
          i === imageIndex ? processedImage : img
        )
      };
      setAssets(newAssets);
      onAssetsUpload(newAssets);
    }
  };

  const AssetSection = ({ 
    title, 
    type, 
    icon: Icon, 
    inputRef 
  }: { 
    title: string; 
    type: 'signatures' | 'stamps' | 'logos'; 
    icon: any; 
    inputRef: React.RefObject<HTMLInputElement> 
  }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <Icon className="w-4 h-4 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files, type)}
        />
        
        <Button
          onClick={() => inputRef.current?.click()}
          variant="outline"
          className="w-full mb-3"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload {title}
        </Button>

        <div className="grid grid-cols-3 gap-2">
          {assets[type].map((asset, index) => (
            <div key={index} className="relative group">
              <img 
                src={asset} 
                alt={`${title} ${index + 1}`} 
                className="w-full h-16 object-cover rounded border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => processImage(asset, type)}
                  className="text-xs px-2 py-1"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeAsset(type, index)}
                  className="text-xs px-2 py-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <AssetSection
        title="Signatures"
        type="signatures"
        icon={FileSignature}
        inputRef={signatureInputRef}
      />
      
      <AssetSection
        title="Stamps"
        type="stamps"
        icon={Award}
        inputRef={stampInputRef}
      />
      
      <AssetSection
        title="Logos"
        type="logos"
        icon={Building}
        inputRef={logoInputRef}
      />

      {showBackgroundRemover && (
        <BackgroundRemover
          image={selectedImage}
          onImageProcessed={handleImageProcessed}
          onClose={() => setShowBackgroundRemover(false)}
        />
      )}
    </div>
  );
};

export default AssetUploader;
