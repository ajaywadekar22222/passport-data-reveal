
import { useState } from "react";
import UploadPage from "../components/UploadPage";
import DataPage from "../components/DataPage";
import DocumentSelectionPage from "../components/DocumentSelectionPage";
import DocumentFillPage from "../components/DocumentFillPage";

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

type PageType = "upload" | "data" | "document-selection" | "document-fill";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("upload");
  const [extractedData, setExtractedData] = useState<PassportData | null>(null);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentTemplate | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
    </div>
  );
};

export default Index;
