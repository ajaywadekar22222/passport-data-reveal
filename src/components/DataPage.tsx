
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileInput } from "lucide-react";
import { PassportData } from "../pages/Index";

interface DataPageProps {
  data: PassportData | null;
  onBackToUpload: () => void;
  onConfirmData: () => void;
  frontImage: string | null;
  backImage: string | null;
}

const DataPage = ({ data, onBackToUpload, onConfirmData, frontImage, backImage }: DataPageProps) => {
  if (!data) return null;

  const dataFields = [
    { label: "Full Name", value: data.name, key: "name" },
    { label: "Date of Birth", value: data.dateOfBirth, key: "dob" },
    { label: "Nationality", value: data.nationality, key: "nationality" },
    { label: "Passport Number", value: data.passportNumber, key: "passport" },
    { label: "Expiry Date", value: data.expiryDate, key: "expiry" },
    { label: "Issuing Country", value: data.issuingCountry, key: "country" },
    { label: "Place of Birth", value: data.placeOfBirth, key: "pob" },
    { label: "Gender", value: data.gender, key: "gender" },
    { label: "Personal Number", value: data.personalNumber, key: "personalNum" },
  ].filter(field => field.value);

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
          Review the information extracted from your passport images
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images Preview */}
        <div className="space-y-6">
          {frontImage && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Front Page
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={frontImage}
                  alt="Passport front"
                  className="w-full max-h-60 rounded-lg shadow-md object-contain"
                />
              </CardContent>
            </Card>
          )}
          
          {backImage && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Back Page
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={backImage}
                  alt="Passport back"
                  className="w-full max-h-60 rounded-lg shadow-md object-contain"
                />
              </CardContent>
            </Card>
          )}
        </div>

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
      <div className="text-center mt-12">
        <div className="text-sm text-gray-500 mb-6">
          Please verify the extracted information above for accuracy
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onBackToUpload}
            variant="outline"
            className="border-gray-400 text-gray-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Upload
          </Button>
          
          <Button 
            onClick={onConfirmData}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Confirm & Select Document
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataPage;
