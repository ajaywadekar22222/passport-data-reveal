
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, FileText, Check, Sparkles, ArrowRight } from "lucide-react";
import { ExtractedData, DocumentTemplate } from "../pages/Index";
import { useToast } from "@/hooks/use-toast";
import CertificatePreview from "./CertificatePreview";

interface DocumentFillPageProps {
  extractedData: ExtractedData | null;
  selectedDocument: DocumentTemplate | null;
  onBackToDocuments: () => void;
}

const DocumentFillPage = ({ extractedData, selectedDocument, onBackToDocuments }: DocumentFillPageProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  if (!extractedData || !selectedDocument) return null;

  // Initialize form data with mapped values
  const initializeFormData = () => {
    const initialData: Record<string, string> = {};
    
    selectedDocument.fields.forEach(field => {
      if (field.mappedTo && extractedData[field.mappedTo]) {
        initialData[field.name] = String(extractedData[field.mappedTo]);
      }
    });
    setFormData(initialData);
  };

  // Initialize form data on component mount
  useState(() => {
    initializeFormData();
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleProceedToPreview = () => {
    // Validate required fields
    const missingFields = selectedDocument.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
  };

  const getFieldValue = (fieldName: string) => {
    return formData[fieldName] || '';
  };

  const getSourceValue = (mappedTo: keyof ExtractedData | undefined) => {
    if (!mappedTo || !extractedData) return null;
    const value = extractedData[mappedTo];
    return typeof value === 'string' ? value : String(value || '');
  };

  if (showPreview) {
    return (
      <CertificatePreview
        extractedData={extractedData}
        selectedDocument={selectedDocument}
        formData={formData}
        onBackToFill={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-8 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Fill Certificate Data
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Review and edit the auto-filled data for your {selectedDocument.name}
        </p>
      </div>

      {/* Company Template Info */}
      <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900 flex items-center">
            <Check className="w-6 h-6 mr-3 text-green-600" />
            {selectedDocument.companyInfo.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium text-lg">{selectedDocument.name}</p>
              <p className="text-blue-600">✨ {selectedDocument.fields.length} fields auto-filled from extracted data</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Certificate will be generated as PDF</p>
              <p className="text-xs text-blue-500">Professional template with company branding</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-3" />
            Certificate Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {selectedDocument.fields.map((field) => (
              <div key={field.id} className="space-y-3">
                <Label className="text-sm font-bold text-gray-700 flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-2 text-lg">*</span>}
                  {field.position && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Positioned
                    </span>
                  )}
                </Label>
                <Input
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={getFieldValue(field.name)}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full text-lg py-3 border-2 focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
                {field.mappedTo && getSourceValue(field.mappedTo) && (
                  <p className="text-sm text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Auto-filled: {getSourceValue(field.mappedTo)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Data Summary */}
      <Card className="mb-8 shadow-xl border-0 bg-gray-50/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            📋 Extracted Source Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">👤 Personal Information</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {extractedData.firstName} {extractedData.lastName}</div>
                <div><strong>DOB:</strong> {extractedData.dob}</div>
                <div><strong>Citizenship:</strong> {extractedData.citizenship}</div>
                <div><strong>Capacity:</strong> {extractedData.capacity}</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">📄 Document Details</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Passport:</strong> {extractedData.passport}</div>
                <div><strong>Country of Birth:</strong> {extractedData.cob}</div>
                <div><strong>Submit Date:</strong> {extractedData.submitDate}</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-lg">🏆 Certificates</h4>
              <div className="space-y-2 text-sm">
                <div><strong>STCW:</strong> {extractedData.certificateNoStcw}</div>
                <div><strong>H2S:</strong> {extractedData.certificateNoH2s}</div>
                <div><strong>BOSET:</strong> {extractedData.certificateNoBoset}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            onClick={onBackToDocuments}
            variant="outline"
            className="border-2 border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg font-bold rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Templates
          </Button>
          
          <Button 
            onClick={handleProceedToPreview}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-3 text-lg font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            <div className="flex items-center space-x-3">
              <ArrowRight className="w-6 h-6" />
              <span>🎨 Preview & Generate Certificate</span>
            </div>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Next step: Upload signatures, stamps, and logos, then generate your professional PDF certificate
        </p>
      </div>
    </div>
  );
};

export default DocumentFillPage;
