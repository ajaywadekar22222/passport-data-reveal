
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentTemplate, DocumentField } from "../pages/Index";

interface AdminDocumentUploadProps {
  onTemplateCreated: (template: DocumentTemplate) => void;
}

const AdminDocumentUpload = ({ onTemplateCreated }: AdminDocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [detectedFields, setDetectedFields] = useState<DocumentField[]>([]);
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
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPEG, PNG) or PDF file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedFile(result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF files, we'll just store the file name for now
      setUploadedFile('pdf-uploaded');
    }

    toast({
      title: "File uploaded successfully",
      description: `Template document ${file.name} has been uploaded.`,
    });
  };

  const analyzeDocumentWithAI = async () => {
    if (!uploadedFile || !templateName) {
      toast({
        title: "Missing information",
        description: "Please upload a document and provide a template name.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis of the document
      // In real implementation, this would call ChatGPT Vision API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock detected fields based on the certificate image shown
      const mockDetectedFields: DocumentField[] = [
        {
          id: "cert-num",
          name: "certificateNumber",
          label: "Certificate Number",
          type: "text",
          required: true,
          position: { x: 120, y: 335 }
        },
        {
          id: "candidate-name",
          name: "candidateName",
          label: "Candidate Name",
          type: "text",
          required: true,
          mappedTo: "firstName",
          position: { x: 600, y: 375 }
        },
        {
          id: "date-birth",
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          required: true,
          mappedTo: "dob",
          position: { x: 220, y: 415 }
        },
        {
          id: "passport-no",
          name: "passportNumber",
          label: "Passport No",
          type: "text",
          required: true,
          mappedTo: "passport",
          position: { x: 555, y: 415 }
        },
        {
          id: "nationality",
          name: "nationality",
          label: "Nationality",
          type: "text",
          required: true,
          mappedTo: "citizenship",
          position: { x: 830, y: 415 }
        },
        {
          id: "date-issue",
          name: "dateOfIssue",
          label: "Date of Issue",
          type: "date",
          required: true,
          position: { x: 540, y: 700 }
        },
        {
          id: "date-expiry",
          name: "dateOfExpiry",
          label: "Date of Expiry",
          type: "date",
          required: true,
          position: { x: 750, y: 700 }
        }
      ];

      setDetectedFields(mockDetectedFields);

      toast({
        title: "Document analysis complete",
        description: `Detected ${mockDetectedFields.length} fillable fields in the document.`,
      });

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the document template.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateFieldMapping = (fieldId: string, mappedTo: string) => {
    setDetectedFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, mappedTo: mappedTo as any }
        : field
    ));
  };

  const removeField = (fieldId: string) => {
    setDetectedFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const addCustomField = () => {
    const newField: DocumentField = {
      id: `custom-${Date.now()}`,
      name: `customField${detectedFields.length + 1}`,
      label: "Custom Field",
      type: "text",
      required: false,
      position: { x: 100, y: 100 }
    };
    setDetectedFields(prev => [...prev, newField]);
  };

  const createTemplate = () => {
    if (!templateName || detectedFields.length === 0) {
      toast({
        title: "Incomplete template",
        description: "Please provide a template name and ensure fields are detected.",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: DocumentTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      type: templateType || "certificate",
      fields: detectedFields,
      imageUrl: uploadedFile === 'pdf-uploaded' ? undefined : uploadedFile || undefined
    };

    onTemplateCreated(newTemplate);

    toast({
      title: "Template created successfully",
      description: `${templateName} template has been created with ${detectedFields.length} fields.`,
    });

    // Reset form
    setUploadedFile(null);
    setFileName("");
    setTemplateName("");
    setTemplateType("");
    setDetectedFields([]);
  };

  const availableMappings = [
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "dob", label: "Date of Birth" },
    { value: "cob", label: "Country of Birth" },
    { value: "citizenship", label: "Citizenship" },
    { value: "passport", label: "Passport Number" },
    { value: "sex", label: "Sex" },
    { value: "capacity", label: "Capacity" },
    { value: "certificateNoStcw", label: "STCW Certificate" },
    { value: "certificateNoH2s", label: "H2S Certificate" },
    { value: "certificateNoBoset", label: "BOSET Certificate" },
  ];

  return (
    <div className="space-y-8">
      {/* File Upload */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Upload Document Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : uploadedFile
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
              accept="image/*,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {uploadedFile ? (
              <div className="space-y-4">
                {uploadedFile !== 'pdf-uploaded' ? (
                  <img src={uploadedFile} alt="Template" className="max-w-full max-h-40 mx-auto rounded-lg" />
                ) : (
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-full">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <p className="text-green-600 font-medium">{fileName}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-400 rounded-full">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium mb-2">Upload Document Template</p>
                  <p className="text-sm text-gray-500">Drag and drop or click to browse (JPEG, PNG, PDF)</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Template Details */}
      {uploadedFile && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Template Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Basic Safety Training Certificate"
                />
              </div>
              <div>
                <Label htmlFor="templateType">Template Type</Label>
                <Input
                  id="templateType"
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  placeholder="e.g., certificate, training, employment"
                />
              </div>
            </div>
            
            <Button
              onClick={analyzeDocumentWithAI}
              disabled={isAnalyzing || !templateName}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Document with AI...</span>
                </div>
              ) : (
                "Analyze Document Fields with AI"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Detected Fields */}
      {detectedFields.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Detected Fields ({detectedFields.length})
              </CardTitle>
              <Button onClick={addCustomField} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detectedFields.map((field) => (
                <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <Label className="text-sm font-medium">Field Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => {
                          setDetectedFields(prev => prev.map(f => 
                            f.id === field.id ? { ...f, label: e.target.value } : f
                          ));
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Data Mapping</Label>
                      <select
                        value={field.mappedTo || ''}
                        onChange={(e) => updateFieldMapping(field.id, e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">No mapping</option>
                        {availableMappings.map(mapping => (
                          <option key={mapping.value} value={mapping.value}>
                            {mapping.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <select
                        value={field.type}
                        onChange={(e) => {
                          setDetectedFields(prev => prev.map(f => 
                            f.id === field.id ? { ...f, type: e.target.value as any } : f
                          ));
                        }}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Text</option>
                        <option value="date">Date</option>
                        <option value="number">Number</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => removeField(field.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {field.position && (
                    <div className="mt-2 text-xs text-gray-500">
                      Position: x:{field.position.x}, y:{field.position.y}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              onClick={createTemplate}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
            >
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDocumentUpload;
