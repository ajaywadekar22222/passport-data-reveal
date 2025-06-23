
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, FileText, Check } from "lucide-react";
import { PassportData, CertificateData, DocumentTemplate } from "../pages/Index";
import { useToast } from "@/hooks/use-toast";

interface DocumentFillPageProps {
  extractedData: PassportData | null;
  certificateData: CertificateData | null;
  selectedDocument: DocumentTemplate | null;
  onBackToDocuments: () => void;
}

const DocumentFillPage = ({ extractedData, certificateData, selectedDocument, onBackToDocuments }: DocumentFillPageProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  if (!extractedData || !selectedDocument) return null;

  // Initialize form data with mapped values from both passport and certificate data
  const initializeFormData = () => {
    const initialData: Record<string, string> = {};
    const allData = { ...extractedData, ...certificateData };
    
    selectedDocument.fields.forEach(field => {
      if (field.mappedTo && allData[field.mappedTo]) {
        initialData[field.name] = String(allData[field.mappedTo]);
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

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    
    // Simulate document generation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create JSON structure for the filled document
    const filledDocumentData = {
      templateInfo: {
        id: selectedDocument.id,
        name: selectedDocument.name,
        type: selectedDocument.type
      },
      filledData: formData,
      sourceData: {
        passportData: extractedData,
        certificateData: certificateData
      },
      timestamp: new Date().toISOString()
    };
    
    console.log("Generated document data:", JSON.stringify(filledDocumentData, null, 2));
    
    setIsGenerating(false);
    
    toast({
      title: "Document generated successfully",
      description: `Your ${selectedDocument.name} has been generated with auto-filled data.`,
    });
    
    // Mock download action - in real implementation, this would send to backend
    const element = document.createElement('a');
    element.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filledDocumentData, null, 2));
    element.download = `${selectedDocument.name.replace(/\s+/g, '_')}_filled.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFieldValue = (fieldName: string) => {
    return formData[fieldName] || '';
  };

  const getSourceValue = (mappedTo: string | undefined) => {
    if (!mappedTo) return null;
    const allData = { ...extractedData, ...certificateData };
    return String(allData[mappedTo] || '');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Auto-Fill Document
        </h1>
        <p className="text-xl text-gray-600">
          Review and edit the auto-filled data for your {selectedDocument.name}
        </p>
      </div>

      {/* Document Template Info */}
      <Card className="mb-8 shadow-lg border-0 bg-blue-50/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Selected Template: {selectedDocument.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">
            {selectedDocument.fields.length} fields will be auto-filled from your passport and certificate data
          </p>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Document Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {selectedDocument.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={getFieldValue(field.name)}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required={field.required}
                />
                {field.mappedTo && getSourceValue(field.mappedTo) && (
                  <p className="text-xs text-green-600">
                    ✓ Auto-filled from: {getSourceValue(field.mappedTo)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Source Reference */}
      <Card className="mb-8 shadow-lg border-0 bg-gray-50/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Source Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Passport Data:</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {extractedData.firstName} {extractedData.lastName}</div>
                <div><strong>DOB:</strong> {extractedData.dob}</div>
                <div><strong>Citizenship:</strong> {extractedData.citizenship}</div>
                <div><strong>Capacity:</strong> {extractedData.capacity}</div>
              </div>
            </div>
            {certificateData && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Certificate Data:</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>STCW:</strong> {certificateData.certificateNoStcw}</div>
                  <div><strong>H2S:</strong> {certificateData.certificateNoH2s}</div>
                  <div><strong>BOSET:</strong> {certificateData.certificateNoBoset}</div>
                  <div><strong>Palau 1:</strong> {certificateData.certificateNoPalau1}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onBackToDocuments}
            variant="outline"
            className="border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Templates
          </Button>
          
          <Button 
            onClick={handleGenerateDocument}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Generate Document
              </>
            )}
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          The generated document will include all the auto-filled passport and certificate data in JSON format
        </p>
      </div>
    </div>
  );
};

export default DocumentFillPage;
