
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { ExtractedData, DocumentTemplate } from '../pages/Index';
import { generateCertificatePDF, downloadCertificate, CertificateData } from './CertificateGenerator';
import AssetUploader from './AssetUploader';
import { useToast } from '@/hooks/use-toast';

interface CertificatePreviewProps {
  extractedData: ExtractedData;
  selectedDocument: DocumentTemplate;
  formData: Record<string, string>;
  onBackToFill: () => void;
}

const CertificatePreview = ({ 
  extractedData, 
  selectedDocument, 
  formData, 
  onBackToFill 
}: CertificatePreviewProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assets, setAssets] = useState({ signatures: [], stamps: [], logos: [] });
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Upload Assets', description: 'Add signatures, stamps, and logos' },
    { id: 2, title: 'Preview Certificate', description: 'Review the final certificate' },
    { id: 3, title: 'Download', description: 'Generate and download PDF' }
  ];

  const handleDownload = async () => {
    if (!previewRef.current) {
      toast({
        title: "Error",
        description: "Certificate preview not ready",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const certificateData: CertificateData = {
        templateInfo: selectedDocument,
        userData: formData,
        extractedData,
        additionalAssets: assets
      };

      await downloadCertificate(certificateData, previewRef.current);
      
      toast({
        title: "Certificate generated successfully!",
        description: "Your certificate has been downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not generate certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderCertificatePreview = () => {
    const candidateName = formData.candidateName || formData.participantName || formData.seamanName || extractedData.firstName;
    
    return (
      <div 
        ref={previewRef}
        className="bg-white p-12 rounded-lg shadow-lg border-2 border-gray-200 min-h-[800px] relative mx-auto max-w-4xl"
        style={{ 
          aspectRatio: '297/210', // A4 landscape ratio
          backgroundImage: selectedDocument.imageUrl ? `url(${selectedDocument.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Company Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border">
            <h1 className="text-4xl font-bold text-blue-900 mb-3">
              {selectedDocument.companyInfo.name}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              CERTIFICATE OF {selectedDocument.name.toUpperCase()}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="text-center mb-8 relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg border">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              This is to certify that
            </p>
            <h3 className="text-3xl font-bold text-blue-900 mb-6 border-b-2 border-blue-200 pb-2">
              {candidateName || 'Certificate Holder'}
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              has successfully completed the requirements for
            </p>
            <h4 className="text-xl font-semibold text-purple-700 mb-8">
              {selectedDocument.name}
            </h4>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
          {selectedDocument.fields.map((field) => {
            const value = formData[field.name] || 'Not provided';
            if (field.name === 'candidateName' || field.name === 'participantName' || field.name === 'seamanName') {
              return null; // Skip name fields as they're shown in the header
            }
            
            return (
              <div 
                key={field.id} 
                className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow border"
              >
                <span className="font-semibold text-gray-700 block mb-2">{field.label}:</span>
                <span className="text-gray-900 font-medium text-lg">{value}</span>
              </div>
            );
          })}
        </div>

        {/* Assets Section */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end relative z-10">
          {/* Signatures */}
          <div className="flex flex-col items-start">
            {assets.signatures.length > 0 && (
              <div className="mb-2">
                <div className="flex space-x-4">
                  {assets.signatures.slice(0, 2).map((sig, index) => (
                    <div key={`sig-${index}`} className="text-center">
                      <img 
                        src={sig} 
                        alt={`Signature ${index + 1}`}
                        className="w-32 h-16 object-contain mb-1"
                      />
                      <div className="w-32 h-0.5 bg-gray-400"></div>
                      <p className="text-xs text-gray-600 mt-1">Authorized Signature</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stamps and Logos */}
          <div className="flex items-end space-x-4">
            {assets.stamps.map((stamp, index) => (
              <img 
                key={`stamp-${index}`} 
                src={stamp} 
                alt={`Stamp ${index + 1}`}
                className="w-20 h-20 object-contain"
              />
            ))}
            {assets.logos.map((logo, index) => (
              <img 
                key={`logo-${index}`} 
                src={logo} 
                alt={`Logo ${index + 1}`}
                className="w-16 h-16 object-contain"
              />
            ))}
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="absolute bottom-2 left-8 right-8 flex justify-between text-sm text-gray-600 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded">
            <p>Certificate ID: ASF-{Date.now().toString().slice(-8)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded">
            <p>Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Upload Additional Assets</h3>
            <p className="text-gray-600 mb-6">Add signatures, stamps, and logos to your certificate</p>
            <AssetUploader 
              onAssetsUpload={setAssets}
              currentAssets={assets}
            />
          </div>
        );
      
      case 2:
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Certificate Preview</h3>
            <p className="text-gray-600 mb-6">Review your certificate before downloading</p>
            {renderCertificatePreview()}
          </div>
        );
      
      case 3:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-lg font-bold">Ready to Download</h3>
            <p className="text-gray-600">
              Your certificate is ready! Click the button below to generate and download the PDF.
            </p>
            <div className="mb-6">
              {renderCertificatePreview()}
            </div>
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating PDF...
                </div>
              ) : (
                <div className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Certificate PDF
                </div>
              )}
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {step.id}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={currentStep === 1 ? onBackToFill : () => setCurrentStep(currentStep - 1)}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Back to Fill' : 'Previous'}
        </Button>
        
        {currentStep < 3 && (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CertificatePreview;
