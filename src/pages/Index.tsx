import { useState } from "react";
import LoginPage from "./LoginPage";
import UploadPage from "../components/UploadPage";
import DataPage from "../components/DataPage";
import DocumentSelectionPage from "../components/DocumentSelectionPage";
import DocumentFillPage from "../components/DocumentFillPage";
import AdminPage from "../components/AdminPage";
import AdminPasswordChange from "../components/AdminPasswordChange";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Key } from "lucide-react";

export interface ExtractedData {
  lastName: string;
  firstName: string;
  dob: string;
  cob: string;
  address: string;
  citizenship: string;
  height: string;
  weight: string;
  sex: string;
  hair: string;
  eyes: string;
  fatherName: string;
  motherName: string;
  submitDate: string;
  passport: string;
  capacity: string;
  certificateNoStcw: string;
  certificateNoStsdsd: string;
  certificateNoH2s: string;
  certificateNoBoset: string;
  certificateNoPalau1: string;
  certificateNoPalau2: string;
  [key: string]: any;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  fields: DocumentField[];
  imageUrl?: string;
  companyInfo: {
    name: string;
    logo?: string;
    signature?: string;
  };
}

export interface DocumentField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'date' | 'number';
  required: boolean;
  mappedTo?: keyof ExtractedData;
  position?: { x: number; y: number; width?: number; height?: number };
}

type PageType = "upload" | "data" | "document-selection" | "document-fill" | "admin";
type UserType = 'admin' | 'user' | null;

const Index = () => {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [adminPassword, setAdminPassword] = useState('1234');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("upload");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentTemplate | null>(null);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([
    {
      id: "stcw-certificate-1",
      name: "STCW Basic Safety Certificate",
      type: "certificate",
      companyInfo: {
        name: "Angel Seafarers Documentation Pvt. Ltd.",
        logo: "/company-logo.png"
      },
      fields: [
        { id: "cert-name", name: "candidateName", label: "Candidate Name", type: "text", required: true, mappedTo: "firstName", position: { x: 300, y: 200 } },
        { id: "cert-dob", name: "dateOfBirth", label: "Date of Birth", type: "date", required: true, mappedTo: "dob", position: { x: 300, y: 250 } },
        { id: "cert-passport", name: "passportNo", label: "Passport Number", type: "text", required: true, mappedTo: "passport", position: { x: 300, y: 300 } },
        { id: "cert-nationality", name: "nationality", label: "Nationality", type: "text", required: true, mappedTo: "citizenship", position: { x: 300, y: 350 } },
        { id: "cert-stcw", name: "stcwNumber", label: "STCW Certificate No", type: "text", required: true, mappedTo: "certificateNoStcw", position: { x: 300, y: 400 } },
      ]
    },
    {
      id: "safety-certificate-1", 
      name: "Safety Training Certificate",
      type: "training",
      companyInfo: {
        name: "Angel Seafarers Documentation Pvt. Ltd.",
        logo: "/company-logo.png"
      },
      fields: [
        { id: "safety-name", name: "participantName", label: "Participant Name", type: "text", required: true, mappedTo: "firstName", position: { x: 250, y: 180 } },
        { id: "safety-h2s", name: "h2sCertificate", label: "H2S Certificate", type: "text", required: false, mappedTo: "certificateNoH2s", position: { x: 250, y: 230 } },
        { id: "safety-boset", name: "bosetCertificate", label: "BOSET Certificate", type: "text", required: false, mappedTo: "certificateNoBoset", position: { x: 250, y: 280 } },
      ]
    },
    {
      id: "seaman-record-1",
      name: "Seaman's Employment Record",
      type: "employment", 
      companyInfo: {
        name: "Angel Seafarers Documentation Pvt. Ltd.",
        logo: "/company-logo.png"
      },
      fields: [
        { id: "emp-name", name: "seamanName", label: "Seaman Name", type: "text", required: true, mappedTo: "firstName", position: { x: 280, y: 160 } },
        { id: "emp-capacity", name: "capacity", label: "Capacity/Rank", type: "text", required: true, mappedTo: "capacity", position: { x: 280, y: 210 } },
        { id: "emp-citizenship", name: "citizenship", label: "Citizenship", type: "text", required: true, mappedTo: "citizenship", position: { x: 280, y: 260 } },
      ]
    }
  ]);

  const handleImagesUpload = (images: string[]) => {
    setUploadedImages(images);
  };

  const handleDataExtraction = (data: ExtractedData) => {
    setExtractedData(data);
    setCurrentPage("data");
  };

  const handleDataConfirm = () => {
    setCurrentPage("document-selection");
  };

  const handleDocumentSelect = (document: DocumentTemplate) => {
    setSelectedDocument(document);
    setCurrentPage("document-fill");
  };

  const handleBackToUpload = () => {
    setCurrentPage("upload");
    setExtractedData(null);
    setUploadedImages([]);
    setSelectedDocument(null);
  };

  const handleBackToData = () => {
    setCurrentPage("data");
  };

  const handleBackToDocuments = () => {
    setCurrentPage("document-selection");
  };

  const handleTemplateCreated = (template: DocumentTemplate) => {
    setDocumentTemplates(prev => [...prev, template]);
  };

  const handleGoToAdmin = () => {
    setCurrentPage("admin");
  };

  const handleBackFromAdmin = () => {
    setCurrentPage("upload");
  };

  const handleLogin = (userType: UserType) => {
    setCurrentUser(userType);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("upload");
    setExtractedData(null);
    setUploadedImages([]);
    setAdditionalImages([]);
    setSelectedDocument(null);
  };

  const handlePasswordChange = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const handleAdditionalImagesUpload = (images: string[]) => {
    setAdditionalImages(images);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Company Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Angel Seafarers Documentation</h1>
              <p className="text-xs text-gray-600">Automated Certificate Generation System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 px-3 py-1 bg-blue-100 rounded-full">
              {currentUser === 'admin' ? '👑 Admin' : '👤 Team Member'}
            </span>
            
            {currentUser === 'admin' && currentPage !== "admin" && (
              <Button
                onClick={handleGoToAdmin}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            
            {currentUser === 'admin' && (
              <Button
                onClick={() => setShowPasswordChange(true)}
                variant="outline"
                size="sm"
              >
                <Key className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <AdminPasswordChange
          onClose={() => setShowPasswordChange(false)}
          onPasswordChange={handlePasswordChange}
        />
      )}

      {currentPage === "upload" && (
        <UploadPage 
          onImagesUpload={handleImagesUpload}
          onDataExtraction={handleDataExtraction}
          uploadedImages={uploadedImages}
        />
      )}
      
      {currentPage === "data" && (
        <DataPage 
          data={extractedData}
          onBackToUpload={handleBackToUpload}
          onConfirmData={handleDataConfirm}
          uploadedImages={uploadedImages}
        />
      )}
      
      {currentPage === "document-selection" && (
        <DocumentSelectionPage 
          onDocumentSelect={handleDocumentSelect}
          onBackToData={handleBackToData}
          templates={documentTemplates}
        />
      )}
      
      {currentPage === "document-fill" && (
        <DocumentFillPage 
          extractedData={extractedData}
          selectedDocument={selectedDocument}
          onBackToDocuments={handleBackToDocuments}
        />
      )}

      {currentPage === "admin" && (
        <AdminPage 
          onBackToMain={handleBackFromAdmin}
          templates={documentTemplates}
          onTemplateCreated={handleTemplateCreated}
        />
      )}
    </div>
  );
};

export default Index;
