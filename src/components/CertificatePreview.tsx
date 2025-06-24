
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Edit, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
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
    if (!previewRef.current) return;
    
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-bold mb-4">Upload Additional Assets</h3>
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
            <div 
              ref={previewRef}
              className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200 min-h-[600px] relative"
              style={{ 
                backgroundImage: selectedDocument.imageUrl ? `url(${selectedDocument.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Company Header */}
              <div className="text-center mb-6 relative z-10">
                <h2 className="text-3xl font-bold text-blue-900 mb-2">
                  {selectedDocument.companyInfo.name}
                </h2>
                <h3 className="text-xl font-semibold text-gray-700">
                  {selectedDocument.name}
                </h3>
              </div>

              {/* Certificate Fields */}
              <div className="space-y-4 relative z-10">
                {selectedDocument.fields.map((field) => (
                  <div 
                    key={field.id} 
                    className="flex justify-between items-center bg-white/80 p-3 rounded"
                    style={field.position ? {
                      position: 'absolute',
                      left: `${field.position.x}px`,
                      top: `${field.position.y}px`,
                      width: field.position.width ? `${field.position.width}px` : 'auto'
                    } : {}}
                  >
                    <span className="font-medium text-gray-700">{field.label}:</span>
                    <span className="text-gray-900 font-semibold">
                      {formData[field.name] || 'Not provided'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Assets */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {assets.signatures.map((sig, index) => (
                  <img 
                    key={`sig-${index}`} 
                    src={sig} 
                    alt={`Signature ${index + 1}`}
                    className="w-24 h-12 object-contain"
                  />
                ))}
                {assets.stamps.map((stamp, index) => (
                  <img 
                    key={`stamp-${index}`} 
                    src={stamp} 
                    alt={`Stamp ${index + 1}`}
                    className="w-16 h-16 object-contain"
                  />
                ))}
              </div>

              {/* Certificate Footer */}
              <div className="absolute bottom-4 left-4 text-sm text-gray-600">
                <p>Certificate ID: ASF-{Date.now()}</p>
                <p>Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-lg font-bold">Ready to Download</h3>
            <p className="text-gray-600">
              Your certificate is ready! Click the button below to generate and download the PDF.
            </p>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {step.id}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {step.id < steps.length && (
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
