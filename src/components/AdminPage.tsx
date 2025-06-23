
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowLeft, Plus } from "lucide-react";
import { DocumentTemplate } from "../pages/Index";
import AdminDocumentUpload from "./AdminDocumentUpload";

interface AdminPageProps {
  onBackToMain: () => void;
  templates: DocumentTemplate[];
  onTemplateCreated: (template: DocumentTemplate) => void;
}

const AdminPage = ({ onBackToMain, templates, onTemplateCreated }: AdminPageProps) => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Manage document templates and configure auto-fill mappings
        </p>
      </div>

      {!showUpload ? (
        <>
          {/* Templates Overview */}
          <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Document Templates ({templates.length})
                </CardTitle>
                <Button 
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No templates created yet</p>
                  <Button 
                    onClick={() => setShowUpload(true)}
                    variant="outline"
                  >
                    Create Your First Template
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold">
                          {template.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500 capitalize">
                          {template.type}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {template.fields.length} fields configured
                          </p>
                          <div className="text-xs text-gray-500">
                            Auto-mapped fields: {template.fields.filter(f => f.mappedTo).length}
                          </div>
                          {template.imageUrl && template.imageUrl !== 'pdf-uploaded' && (
                            <img 
                              src={template.imageUrl} 
                              alt={template.name}
                              className="w-full h-20 object-cover rounded mt-2"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center">
            <Button
              onClick={onBackToMain}
              variant="outline"
              className="border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Main App
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Upload Interface */}
          <div className="mb-8">
            <Button
              onClick={() => setShowUpload(false)}
              variant="outline"
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
            
            <AdminDocumentUpload 
              onTemplateCreated={(template) => {
                onTemplateCreated(template);
                setShowUpload(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
