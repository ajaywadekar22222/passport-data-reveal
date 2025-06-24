
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadAreaSecondaryProps {
  onImagesUpload: (images: string[]) => void;
  uploadedImages: string[];
  title: string;
  description: string;
}

const UploadAreaSecondary = ({ 
  onImagesUpload, 
  uploadedImages, 
  title, 
  description 
}: UploadAreaSecondaryProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(Array.from(files));
    }
  };

  const handleFileSelection = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (validFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload image files (JPEG, PNG) or PDF documents",
        variant: "destructive",
      });
      return;
    }

    const promises = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        if (file.type === 'application/pdf') {
          resolve('pdf-document');
        } else {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        }
      });
    });

    Promise.all(promises).then(results => {
      onImagesUpload([...uploadedImages, ...results]);
      toast({
        title: "Documents uploaded successfully",
        description: `${validFiles.length} additional document(s) ready for processing`,
      });
    });
  };

  return (
    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragging
              ? "border-purple-400 bg-purple-50 scale-105"
              : uploadedImages.length > 0
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:scale-105"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
          
          {uploadedImages.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-3">
                {uploadedImages.slice(0, 2).map((image, index) => (
                  <div key={index} className="relative">
                    {image === 'pdf-document' ? (
                      <div className="w-16 h-20 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                    ) : (
                      <img src={image} alt={`Document ${index + 1}`} className="w-16 h-20 object-cover rounded-lg shadow-md" />
                    )}
                  </div>
                ))}
                {uploadedImages.length > 2 && (
                  <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-sm">+{uploadedImages.length - 2}</span>
                  </div>
                )}
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-green-600 font-medium">{uploadedImages.length} document(s) uploaded</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Upload Additional Documents</p>
                <p className="text-gray-500 text-sm">Drag and drop or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadAreaSecondary;
