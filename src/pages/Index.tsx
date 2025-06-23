
import { useState } from "react";
import UploadPage from "../components/UploadPage";
import DataPage from "../components/DataPage";

export interface PassportData {
  name: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  expiryDate: string;
  issuingCountry: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"upload" | "data">("upload");
  const [extractedData, setExtractedData] = useState<PassportData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
  };

  const handleDataExtraction = (data: PassportData) => {
    setExtractedData(data);
    setCurrentPage("data");
  };

  const handleBackToUpload = () => {
    setCurrentPage("upload");
    setExtractedData(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {currentPage === "upload" ? (
        <UploadPage 
          onImageUpload={handleImageUpload}
          onDataExtraction={handleDataExtraction}
          uploadedImage={uploadedImage}
        />
      ) : (
        <DataPage 
          data={extractedData}
          onBackToUpload={handleBackToUpload}
          uploadedImage={uploadedImage}
        />
      )}
    </div>
  );
};

export default Index;
