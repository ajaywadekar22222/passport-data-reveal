
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileInput } from "lucide-react";
import { PassportData, CertificateData } from "../pages/Index";

interface DataPageProps {
  data: PassportData | null;
  certificateData: CertificateData | null;
  onBackToUpload: () => void;
  onConfirmData: () => void;
  frontImage: string | null;
  backImage: string | null;
}

const DataPage = ({ data, certificateData, onBackToUpload, onConfirmData, frontImage, backImage }: DataPageProps) => {
  if (!data) return null;

  const passportFields = [
    { label: "Last Name", value: data.lastName, key: "lastName" },
    { label: "First Name", value: data.firstName, key: "firstName" },
    { label: "Date of Birth", value: data.dob, key: "dob" },
    { label: "Country of Birth", value: data.cob, key: "cob" },
    { label: "Citizenship", value: data.citizenship, key: "citizenship" },
    { label: "Sex", value: data.sex, key: "sex" },
    { label: "Hair Color", value: data.hair, key: "hair" },
    { label: "Eye Color", value: data.eyes, key: "eyes" },
    { label: "Submit Date", value: data.submitDate, key: "submitDate" },
    { label: "Passport Number", value: data.passport, key: "passport" },
    { label: "Capacity", value: data.capacity, key: "capacity" },
  ].filter(field => field.value);

  const certificateFields = certificateData ? [
    { label: "STCW Certificate", value: certificateData.certificateNoStcw, key: "stcw" },
    { label: "STSDSD Certificate", value: certificateData.certificateNoStsdsd, key: "stsdsd" },
    { label: "H2S Certificate", value: certificateData.certificateNoH2s, key: "h2s" },
    { label: "BOSET Certificate", value: certificateData.certificateNoBoset, key: "boset" },
    { label: "Palau Certificate 1", value: certificateData.certificateNoPalau1, key: "palau1" },
    { label: "Palau Certificate 2", value: certificateData.certificateNoPalau2, key: "palau2" },
  ].filter(field => field.value) : [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
          <FileInput className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Extracted Data Review
        </h1>
        <p className="text-xl text-gray-600">
          Review the passport and certificate information extracted from your images
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
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

        {/* Passport Data */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Passport Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {passportFields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {field.label}
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <span className="text-gray-900 text-sm">{field.value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certificate Data */}
        {certificateFields.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Certificate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificateFields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {field.label}
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <span className="text-gray-900 text-sm">{field.value}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
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
