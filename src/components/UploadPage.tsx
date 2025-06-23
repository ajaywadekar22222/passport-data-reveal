
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon, FileInput, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExtractedData } from "../pages/Index";

interface UploadPageProps {
  onImagesUpload: (images: string[]) => void;
  onDataExtraction: (data: ExtractedData) => void;
  uploadedImages: string[];
}

const UploadPage = ({ onImagesUpload, onDataExtraction, uploadedImages }: UploadPageProps) => {
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
      handleMultipleFileSelection(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMultipleFileSelection(Array.from(files));
    }
  };

  const handleMultipleFileSelection = (files: File[]) => {
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
      onImagesUpload(results);
      toast({
        title: "Documents uploaded successfully",
        description: `${validFiles.length} document(s) ready for processing`,
      });
    });
  };

  const processWithAI = async (imageData: string[]) => {
    // Simulate AI processing with ChatGPT Vision API
    const prompt = `Extract all personal and certificate data from these documents in JSON format. 
    Return structured data for: personal info, passport details, and all certificate numbers.`;
    
    console.log("Processing documents with AI prompt:", prompt);
    console.log("Document count:", imageData.length);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Mock comprehensive extracted data
    const extractedData: ExtractedData = {
      lastName: "RAIZADA",
      firstName: "SURYA PRATAP SINGH", 
      dob: "1998-09-03",
      cob: "GUWAHATI ASSAM",
      address: "123 Marine Drive, Mumbai",
      citizenship: "INDIAN",
      height: "175 cm",
      weight: "70 kg",
      sex: "MALE",
      hair: "BLACK",
      eyes: "BLACK",
      fatherName: "RAJESH RAIZADA",
      motherName: "SUNITA RAIZADA",
      submitDate: "23/06/2025",
      passport: "Q1234567",
      capacity: "Ordinary Seaman",
      certificateNoStcw: "01134-0001",
      certificateNoStsdsd: "01018-0001", 
      certificateNoH2s: "01102-0001",
      certificateNoBoset: "01106-0001",
      certificateNoPalau1: "PLU-456",
      certificateNoPalau2: "PLU-789"
    };
    
    return extractedData;
  };

  const handleProcessDocuments = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No documents uploaded",
        description: "Please upload at least one document to process.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const extractedData = await processWithAI(uploadedImages);
      onDataExtraction(extractedData);
      
      toast({
        title: "✨ Data extracted successfully",
        description: "AI has processed your documents and extracted all relevant information.",
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: "Failed to extract data from documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-8 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          AI-Powered Document Scanner
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Upload any documents (passports, certificates, IDs) and our advanced AI will automatically extract all information for instant certificate generation.
        </p>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multi-Document Upload</h3>
            <p className="text-sm text-gray-600">Upload multiple document types in any format</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-indigo-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI OCR Processing</h3>
            <p className="text-sm text-gray-600">Advanced AI extracts all relevant data automatically</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <FileInput className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Certificates</h3>
            <p className="text-sm text-gray-600">Generate professional certificates in seconds</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-sm mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-2xl font-bold text-gray-900 text-center">
            Upload Documents for Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50 scale-105"
                : uploadedImages.length > 0
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:scale-105"
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
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-4">
                  {uploadedImages.slice(0, 3).map((image, index) => (
                    <div key={index} className="relative">
                      {image === 'pdf-document' ? (
                        <div className="w-24 h-32 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileInput className="w-8 h-8 text-red-600" />
                        </div>
                      ) : (
                        <img src={image} alt={`Document ${index + 1}`} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                      )}
                    </div>
                  ))}
                  {uploadedImages.length > 3 && (
                    <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-medium">+{uploadedImages.length - 3}</span>
                    </div>
                  )}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full animate-pulse">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-green-600 font-bold text-lg">{uploadedImages.length} document(s) uploaded</p>
                  <p className="text-green-500 text-sm">Ready for AI processing</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-bold text-xl mb-3">Upload Your Documents</p>
                  <p className="text-gray-500 mb-4">Drag and drop or click to browse</p>
                  <p className="text-sm text-gray-400">Supports: JPEG, PNG, PDF • Multiple files allowed</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Button */}
      {uploadedImages.length > 0 && (
        <div className="text-center">
          <Button
            onClick={handleProcessDocuments}
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>🤖 AI Processing Documents...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <span>✨ Extract Data with AI</span>
              </div>
            )}
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Our AI will analyze your documents and extract all relevant information automatically
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
