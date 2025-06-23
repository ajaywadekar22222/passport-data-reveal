
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Award, CreditCard, FileCheck } from "lucide-react";
import { DocumentTemplate } from "../pages/Index";

interface DocumentSelectionPageProps {
  onDocumentSelect: (document: DocumentTemplate) => void;
  onBackToData: () => void;
}

const DocumentSelectionPage = ({ onDocumentSelect, onBackToData }: DocumentSelectionPageProps) => {
  // Mock document templates with updated field mappings for your JSON structure
  const documentTemplates: DocumentTemplate[] = [
    {
      id: "seamans-certificate-1",
      name: "Seaman's Certificate",
      type: "certificate",
      fields: [
        { id: "cert-lastName", name: "lastName", label: "Last Name", type: "text", required: true, mappedTo: "lastName" },
        { id: "cert-firstName", name: "firstName", label: "First Name", type: "text", required: true, mappedTo: "firstName" },
        { id: "cert-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dob" },
        { id: "cert-cob", name: "countryOfBirth", label: "Country of Birth", type: "text", required: true, mappedTo: "cob" },
        { id: "cert-capacity", name: "capacity", label: "Capacity", type: "text", required: true, mappedTo: "capacity" },
        { id: "cert-stcw", name: "stcwCertificate", label: "STCW Certificate No", type: "text", required: true, mappedTo: "certificateNoStcw" },
      ]
    },
    {
      id: "crew-id-card-1",
      name: "Crew ID Card",
      type: "id-card",
      fields: [
        { id: "id-lastName", name: "lastName", label: "Last Name", type: "text", required: true, mappedTo: "lastName" },
        { id: "id-firstName", name: "firstName", label: "First Name", type: "text", required: true, mappedTo: "firstName" },
        { id: "id-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dob" },
        { id: "id-sex", name: "sex", label: "Sex", type: "text", required: true, mappedTo: "sex" },
        { id: "id-hair", name: "hairColor", label: "Hair Color", type: "text", required: false, mappedTo: "hair" },
        { id: "id-eyes", name: "eyeColor", label: "Eye Color", type: "text", required: false, mappedTo: "eyes" },
      ]
    },
    {
      id: "training-certificate-1",
      name: "Training Certificate",
      type: "training",
      fields: [
        { id: "train-lastName", name: "lastName", label: "Last Name", type: "text", required: true, mappedTo: "lastName" },
        { id: "train-firstName", name: "firstName", label: "First Name", type: "text", required: true, mappedTo: "firstName" },
        { id: "train-h2s", name: "h2sCertificate", label: "H2S Certificate", type: "text", required: false, mappedTo: "certificateNoH2s" },
        { id: "train-boset", name: "bosetCertificate", label: "BOSET Certificate", type: "text", required: false, mappedTo: "certificateNoBoset" },
        { id: "train-palau1", name: "palauCertificate1", label: "Palau Certificate 1", type: "text", required: false, mappedTo: "certificateNoPalau1" },
      ]
    },
    {
      id: "employment-record-1",
      name: "Employment Record",
      type: "employment",
      fields: [
        { id: "emp-lastName", name: "lastName", label: "Last Name", type: "text", required: true, mappedTo: "lastName" },
        { id: "emp-firstName", name: "firstName", label: "First Name", type: "text", required: true, mappedTo: "firstName" },
        { id: "emp-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dob" },
        { id: "emp-citizenship", name: "citizenship", label: "Citizenship", type: "text", required: true, mappedTo: "citizenship" },
        { id: "emp-capacity", name: "capacity", label: "Capacity", type: "text", required: true, mappedTo: "capacity" },
        { id: "emp-submitDate", name: "submitDate", label: "Submit Date", type: "date", required: false, mappedTo: "submitDate" },
      ]
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "certificate": return Award;
      case "id-card": return CreditCard;
      case "training": return FileCheck;
      case "employment": return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Select Document Template
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the document template where you want to auto-fill the extracted passport and certificate data
        </p>
      </div>

      {/* Document Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {documentTemplates.map((template) => {
          const IconComponent = getDocumentIcon(template.type);
          return (
            <Card 
              key={template.id} 
              className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => onDocumentSelect(template)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 capitalize">{template.type.replace('-', ' ')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Fields to be auto-filled:
                  </p>
                  <div className="space-y-1">
                    {template.fields.slice(0, 4).map((field) => (
                      <div key={field.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{field.label}</span>
                        {field.required && (
                          <span className="text-red-500 text-xs">Required</span>
                        )}
                      </div>
                    ))}
                    {template.fields.length > 4 && (
                      <p className="text-xs text-gray-500 italic">
                        +{template.fields.length - 4} more fields...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Button
          onClick={onBackToData}
          variant="outline"
          className="border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Data Review
        </Button>
      </div>
    </div>
  );
};

export default DocumentSelectionPage;
