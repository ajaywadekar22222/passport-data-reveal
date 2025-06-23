
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Award, CreditCard, FileCheck } from "lucide-react";
import { DocumentTemplate } from "../pages/Index";

interface DocumentSelectionPageProps {
  onDocumentSelect: (document: DocumentTemplate) => void;
  onBackToData: () => void;
}

const DocumentSelectionPage = ({ onDocumentSelect, onBackToData }: DocumentSelectionPageProps) => {
  // Mock document templates that would be uploaded by admin
  const documentTemplates: DocumentTemplate[] = [
    {
      id: "certificate-1",
      name: "Employment Certificate",
      type: "certificate",
      fields: [
        { id: "emp-name", name: "employeeName", label: "Employee Name", type: "text", required: true, mappedTo: "name" },
        { id: "emp-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dateOfBirth" },
        { id: "emp-nationality", name: "nationality", label: "Nationality", type: "text", required: true, mappedTo: "nationality" },
        { id: "emp-passport", name: "passportNumber", label: "Passport Number", type: "text", required: true, mappedTo: "passportNumber" },
      ]
    },
    {
      id: "id-card-1",
      name: "Company ID Card",
      type: "id-card",
      fields: [
        { id: "id-name", name: "fullName", label: "Full Name", type: "text", required: true, mappedTo: "name" },
        { id: "id-dob", name: "birthDate", label: "Birth Date", type: "date", required: true, mappedTo: "dateOfBirth" },
        { id: "id-nationality", name: "nationality", label: "Nationality", type: "text", required: true, mappedTo: "nationality" },
      ]
    },
    {
      id: "visa-app-1",
      name: "Visa Application Form",
      type: "visa-application",
      fields: [
        { id: "visa-name", name: "applicantName", label: "Applicant Name", type: "text", required: true, mappedTo: "name" },
        { id: "visa-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dateOfBirth" },
        { id: "visa-nationality", name: "nationality", label: "Nationality", type: "text", required: true, mappedTo: "nationality" },
        { id: "visa-passport", name: "passportNumber", label: "Passport Number", type: "text", required: true, mappedTo: "passportNumber" },
        { id: "visa-expiry", name: "passportExpiry", label: "Passport Expiry", type: "date", required: true, mappedTo: "expiryDate" },
        { id: "visa-pob", name: "placeOfBirth", label: "Place of Birth", type: "text", required: false, mappedTo: "placeOfBirth" },
      ]
    },
    {
      id: "membership-1",
      name: "Membership Registration",
      type: "membership",
      fields: [
        { id: "member-name", name: "memberName", label: "Member Name", type: "text", required: true, mappedTo: "name" },
        { id: "member-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dateOfBirth" },
        { id: "member-nationality", name: "nationality", label: "Nationality", type: "text", required: true, mappedTo: "nationality" },
      ]
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "certificate": return Award;
      case "id-card": return CreditCard;
      case "visa-application": return FileCheck;
      case "membership": return FileText;
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
          Choose the document template where you want to auto-fill the extracted passport data
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
