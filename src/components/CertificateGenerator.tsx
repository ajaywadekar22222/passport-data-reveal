
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExtractedData, DocumentTemplate } from '../pages/Index';

export interface CertificateData {
  templateInfo: DocumentTemplate;
  userData: Record<string, string>;
  extractedData: ExtractedData;
  additionalAssets: {
    signatures: string[];
    stamps: string[];
    logos: string[];
  };
}

export const generateCertificatePDF = async (
  certificateData: CertificateData,
  previewElement: HTMLElement
): Promise<Blob> => {
  try {
    // Convert the preview element to canvas
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 297; // A4 landscape width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Add metadata
    pdf.setProperties({
      title: `${certificateData.templateInfo.name} - ${certificateData.userData.candidateName || 'Certificate'}`,
      subject: certificateData.templateInfo.name,
      author: 'Angel Seafarers Documentation Pvt. Ltd.',
      creator: 'Angel Seafarers Documentation System'
    });

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate certificate PDF');
  }
};

export const downloadCertificate = async (
  certificateData: CertificateData,
  previewElement: HTMLElement
) => {
  try {
    const pdfBlob = await generateCertificatePDF(certificateData, previewElement);
    
    const userName = certificateData.userData.candidateName || 
                     certificateData.extractedData.firstName || 
                     'Certificate';
    
    const fileName = `${userName.replace(/\s+/g, '_')}_${certificateData.templateInfo.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
