import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon, FileInput } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PassportData, CertificateData } from "../pages/Index";

interface UploadPageProps {
  onImagesUpload: (front: string, back: string) => void;
  onDataExtraction: (data: PassportData, certificates: CertificateData) => void;
  frontImage: string | null;
  backImage: string | null;
}

const UploadPage = ({ onImagesUpload, onDataExtraction, frontImage, backImage }: UploadPageProps) => {
  const [isDraggingFront, setIsDraggingFront] = useState(false);
  const [isDraggingBack, setIsDraggingBack] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    if (type === 'front') setIsDraggingFront(true);
    else setIsDraggingBack(true);
  };

  const handleDragLeave = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    if (type === 'front') setIsDraggingFront(false);
    else setIsDraggingBack(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'front' | 'back') => {
    e.preventDefault();
    if (type === 'front') setIsDraggingFront(false);
    else setIsDraggingBack(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0], type);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file, type);
    }
  };

  const handleFileSelection = (file: File, type: 'front' | 'back') => {
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
      
      if (type === 'front') {
        onImagesUpload(result, backImage || '');
      } else {
        onImagesUpload(frontImage || '', result);
      }
      
      toast({
        title: `${type === 'front' ? 'Front' : 'Back'} image uploaded`,
        description: `Your passport ${type} page has been uploaded successfully.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const processWithChatGPT = async (frontImageData: string, backImageData: string) => {
    // This would normally call ChatGPT API with vision capabilities
    // For now, we'll simulate the response with your JSON structure
    
    const prompt = `Extract passport and certificate data from these images in JSON format. 
    Return two objects: passportData and certificateData with the following structure:
    
    passportData: {
      lastName, firstName, dob, cob, address, citizenship, height, weight, sex, hair, eyes, fatherName, motherName, submitDate, passport, capacity
    }
    
    certificateData: {
      certificateNoStcw, certificateNoStsdsd, certificateNoH2s, certificateNoBoset, certificateNoPalau1, certificateNoPalau2
    }`;
    
    console.log("Processing images with prompt:", prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data matching your JSON structure
    const passportData: PassportData = {
      lastName: "RAIZADA",
      firstName: "SURYA PRATAP SINGH", 
      dob: "1998-09-03",
      cob: "GUWAHATI ASSAM",
      address: "",
      citizenship: "SUENA / SUMAME",
      height: "",
      weight: "",
      sex: "FEMALE",
      hair: "BLACK",
      eyes: "BLACK",
      fatherName: "",
      motherName: "",
      submitDate: "23/06/2025",
      passport: "Q OR Q IE",
      capacity: "Ordinary Seaman"
    };

    const certificateData: CertificateData = {
      certificateNoStcw: "01134            0001",
      certificateNoStsdsd: "01018            0001", 
      certificateNoH2s: "01102            0001",
      certificateNoBoset: "01106            0001",
      certificateNoPalau1: "456",
      certificateNoPalau2: "456"
    };
    
    return { passportData, certificateData };
  };

  const handleProcessImages = async () => {
    if (!frontImage || !backImage) {
      toast({
        title: "Missing images",
        description: "Please upload both front and back passport images.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { passportData, certificateData } = await processWithChatGPT(frontImage, backImage);
      onDataExtraction(passportData, certificateData);
      
      toast({
        title: "Data extracted successfully",
        description: "Passport and certificate information has been processed using AI.",
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: "Failed to extract data from passport images.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUploadCard = (
    title: string, 
    type: 'front' | 'back', 
    image: string | null, 
    isDragging: boolean,
    inputRef: React.RefObject<HTMLInputElement>
  ) => (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : image
              ? "border-green-400 bg-green-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={(e) => handleDragLeave(e, type)}
          onDrop={(e) => handleDrop(e, type)}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileInputChange(e, type)}
            className="hidden"
          />
          
          {image ? (
            <div className="space-y-4">
              <img src={image} alt={`Passport ${type}`} className="max-w-full max-h-40 mx-auto rounded-lg" />
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-green-600 font-medium">Image uploaded</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-400 rounded-full">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-2">Upload {title}</p>
                <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
          <FileInput className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Passport & Certificate Scanner
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload both sides of your passport and our AI will automatically extract all information including certificate data to fill your documents.
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {renderUploadCard(
          "Passport Front Page", 
          'front', 
          frontImage, 
          isDraggingFront, 
          frontInputRef
        )}
        {renderUploadCard(
          "Passport Back Page", 
          'back', 
          backImage, 
          isDraggingBack, 
          backInputRef
        )}
      </div>

      {/* Process Button */}
      {frontImage && backImage && (
        <div className="text-center">
          <Button
            onClick={handleProcessImages}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing with AI...</span>
              </div>
            ) : (
              "Extract Data with ChatGPT"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
