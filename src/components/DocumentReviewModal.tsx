
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Eye, Download } from "lucide-react";
import { ExtractedData, DocumentTemplate } from "../pages/Index";

interface DocumentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedData: ExtractedData | null;
  selectedDocument: DocumentTemplate | null;
  formData: Record<string, string>;
  onSave: (data: Record<string, string>) => void;
  onDownload: () => void;
}

const DocumentReviewModal = ({
  isOpen,
  onClose,
  extractedData,
  selectedDocument,
  formData,
  onSave,
  onDownload
}: DocumentReviewModalProps) => {
  const [editableData, setEditableData] = useState(formData);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (!isOpen || !selectedDocument) return null;

  const handleSave = () => {
    onSave(editableData);
    onClose();
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            Final Review & Edit - {selectedDocument.name}
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isPreviewMode ? (
            // Preview Mode
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Certificate Preview</h3>
              <div className="bg-white p-8 rounded-lg shadow-inner border-2 border-dashed border-gray-300">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">{selectedDocument.companyInfo.name}</h2>
                  <h3 className="text-lg font-semibold text-gray-700 mt-2">{selectedDocument.name}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedDocument.fields.map((field) => (
                    <div key={field.id} className="border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-600">{field.label}:</span>
                      <span className="ml-2 text-gray-900">{editableData[field.name] || 'Not filled'}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">Certificate ID: ASF-{Date.now()}</p>
                  <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="grid md:grid-cols-2 gap-6">
              {selectedDocument.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.type === 'text' && field.label.toLowerCase().includes('address') ? (
                    <Textarea
                      value={editableData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full"
                      rows={3}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <Input
                      type={field.type === 'date' ? 'date' : 'text'}
                      value={editableData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                  {field.mappedTo && extractedData?.[field.mappedTo] && (
                    <p className="text-xs text-green-600">
                      Source: {String(extractedData[field.mappedTo])}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              onClick={onDownload} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentReviewModal;
