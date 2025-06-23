import { useState } from "react";
import UploadPage from "../components/UploadPage";
import DataPage from "../components/DataPage";
import DocumentSelectionPage from "../components/DocumentSelectionPage";
import DocumentFillPage from "../components/DocumentFillPage";
import AdminPage from "../components/AdminPage";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export interface PassportData {
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
  [key: string]: any;
}

export interface CertificateData {
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
}

export interface DocumentField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'date' | 'number';
  required: boolean;
  mappedTo?: keyof PassportData | keyof CertificateData;
  position?: { x: number; y: number };
}

type PageType = "upload" | "data" | "document-selection" | "document-fill" | "admin";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("upload");
  const [extractedData, setExtractedData] = useState<PassportData | null>(null);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentTemplate | null>(null);
  const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([
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
  ]);

  const handleImagesUpload = (front: string, back: string) => {
    setFrontImage(front);
    setBackImage(back);
  };

  const handleDataExtraction = (data: PassportData, certificates: CertificateData) => {
    setExtractedData(data);
    setCertificateData(certificates);
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
    setCertificateData(null);
    setFrontImage(null);
    setBackImage(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Admin Button - Fixed Position */}
      {currentPage !== "admin" && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleGoToAdmin}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      )}

      {currentPage === "upload" && (
        <UploadPage 
          onImagesUpload={handleImagesUpload}
          onDataExtraction={handleDataExtraction}
          frontImage={frontImage}
          backImage={backImage}
        />
      )}
      
      {currentPage === "data" && (
        <DataPage 
          data={extractedData}
          certificateData={certificateData}
          onBackToUpload={handleBackToUpload}
          onConfirmData={handleDataConfirm}
          frontImage={frontImage}
          backImage={backImage}
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
          certificateData={certificateData}
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
