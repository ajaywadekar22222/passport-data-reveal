
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image as ImageIcon, FileInput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PassportData } from "../pages/Index";

interface UploadPageProps {
  onImageUpload: (imageData: string) => void;
  onDataExtraction: (data: PassportData) => void;
  uploadedImage: string | null;
}

const UploadPage = ({ onImageUpload, onDataExtraction, uploadedImage }: UploadPageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
      toast({
        title: "Image uploaded successfully",
        description: "Your passport image has been uploaded and is ready for processing.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data
    const mockData: PassportData = {
      name: "JOHN MICHAEL SMITH",
      dateOfBirth: "15 MAR 1985",
      nationality: "AMERICAN",
      passportNumber: "123456789",
      expiryDate: "14 MAR 2030",
      issuingCountry: "UNITED STATES OF AMERICA"
    };
    
    setIsProcessing(false);
    onDataExtraction(mockData);
    
    toast({
      title: "Data extracted successfully",
      description: "Passport information has been processed and extracted.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
          <FileInput className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Passport OCR Scanner
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your passport image and our advanced OCR technology will automatically extract all relevant information in seconds.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : uploadedImage
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Image Uploaded Successfully
                  </h3>
                  <p className="text-green-600">
                    Your passport image is ready for processing
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-400 rounded-full">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Upload Passport Image
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Drag and drop your passport image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports JPEG, PNG, and other image formats
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {uploadedImage && (
        <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Preview</h3>
            <div className="flex justify-center">
              <img
                src={uploadedImage}
                alt="Uploaded passport"
                className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Button */}
      {uploadedImage && (
        <div className="text-center">
          <Button
            onClick={handleProcessImage}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Extract Passport Data"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
