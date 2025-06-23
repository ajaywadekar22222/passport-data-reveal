
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, FileInput } from "lucide-react";
import { PassportData } from "../pages/Index";

interface DataPageProps {
  data: PassportData | null;
  onBackToUpload: () => void;
  uploadedImage: string | null;
}

const DataPage = ({ data, onBackToUpload, uploadedImage }: DataPageProps) => {
  if (!data) return null;

  const dataFields = [
    { label: "Full Name", value: data.name, key: "name" },
    { label: "Date of Birth", value: data.dateOfBirth, key: "dob" },
    { label: "Nationality", value: data.nationality, key: "nationality" },
    { label: "Passport Number", value: data.passportNumber, key: "passport" },
    { label: "Expiry Date", value: data.expiryDate, key: "expiry" },
    { label: "Issuing Country", value: data.issuingCountry, key: "country" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
          <FileInput className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Extracted Passport Data
        </h1>
        <p className="text-xl text-gray-600">
          Below is the information extracted from your passport image
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        {uploadedImage && (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Original Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src={uploadedImage}
                  alt="Uploaded passport"
                  className="max-w-full max-h-80 rounded-lg shadow-md object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extracted Data */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Extracted Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {dataFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {field.label}
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-900 font-medium">{field.value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-12 space-y-4">
        <div className="text-sm text-gray-500 mb-4">
          Please verify the extracted information above for accuracy
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onBackToUpload}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
          >
            <ArrowUp className="w-5 h-5 mr-2" />
            Upload New Image
          </Button>
          
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            Download as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataPage;
