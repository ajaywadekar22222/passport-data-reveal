
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
    console.log('Starting PDF generation...');
    
    // Wait a moment for any animations to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Convert the preview element to canvas with high quality
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: previewElement.scrollWidth,
      height: previewElement.scrollHeight,
      logging: false
    });

    console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

    // Create PDF in landscape orientation
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = 297; // A4 landscape width in mm
    const pdfHeight = 210; // A4 landscape height in mm
    
    // Calculate dimensions to fit the page while maintaining aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;
    
    let imgWidth = pdfWidth;
    let imgHeight = pdfHeight;
    let xOffset = 0;
    let yOffset = 0;
    
    if (canvasAspectRatio > pdfAspectRatio) {
      // Image is wider than PDF page
      imgHeight = pdfWidth / canvasAspectRatio;
      yOffset = (pdfHeight - imgHeight) / 2;
    } else {
      // Image is taller than PDF page
      imgWidth = pdfHeight * canvasAspectRatio;
      xOffset = (pdfWidth - imgWidth) / 2;
    }

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    // Add metadata
    const candidateName = certificateData.userData.candidateName || 
                         certificateData.userData.participantName || 
                         certificateData.userData.seamanName || 
                         certificateData.extractedData.firstName || 
                         'Certificate Holder';

    pdf.setProperties({
      title: `${certificateData.templateInfo.name} - ${candidateName}`,
      subject: certificateData.templateInfo.name,
      author: certificateData.templateInfo.companyInfo.name,
      creator: 'Angel Seafarers Documentation System',
      keywords: 'certificate, maritime, seafarer'
    });

    console.log('PDF generated successfully');
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate certificate PDF: ${error.message}`);
  }
};

export const downloadCertificate = async (
  certificateData: CertificateData,
  previewElement: HTMLElement
) => {
  try {
    console.log('Starting certificate download...');
    const pdfBlob = await generateCertificatePDF(certificateData, previewElement);
    
    const candidateName = certificateData.userData.candidateName || 
                         certificateData.userData.participantName || 
                         certificateData.userData.seamanName || 
                         certificateData.extractedData.firstName || 
                         'Certificate';
    
    const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanTemplateName = certificateData.templateInfo.name.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    
    const fileName = `${cleanName}_${cleanTemplateName}_${timestamp}.pdf`;
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('Certificate downloaded successfully:', fileName);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
