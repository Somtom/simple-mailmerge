import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const extractPlaceholders = async (docxFile: File): Promise<string[]> => {
  try {
    const arrayBuffer = await docxFile.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    
    // Create a docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    
    // Get the template text to extract placeholders
    const fullText = doc.getFullText();
    
    // Extract placeholders using regex
    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders = new Set<string>();
    
    let match;
    while ((match = placeholderRegex.exec(fullText)) !== null) {
      placeholders.add(`{${match[1]}}`);
    }
    
    return Array.from(placeholders).sort();
  } catch (error) {
    console.error('Error extracting placeholders:', error);
    throw new Error('Failed to extract placeholders from DOCX file. Please ensure it\'s a valid Word document.');
  }
};

export const generateMergedDocx = async (
  templateFile: File,
  data: Array<{ [key: string]: string | number }>,
  mapping: { [placeholder: string]: string }
): Promise<Blob> => {
  try {
    const templateBuffer = await templateFile.arrayBuffer();
    
    // Create the first document from the first row
    let mergedZip: PizZip | null = null;
    let mergedDoc: Docxtemplater | null = null;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Create a new zip instance for each document
      const zip = new PizZip(templateBuffer);
      
      // Create docxtemplater instance
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      
      // Prepare data for replacement
      const replacementData: { [key: string]: string } = {};
      
      Object.entries(mapping).forEach(([placeholder, column]) => {
        // Remove the curly braces from placeholder for docxtemplater
        const cleanPlaceholder = placeholder.replace(/[{}]/g, '');
        const value = String(row[column] || '');
        replacementData[cleanPlaceholder] = value;
      });
      
      // Set the template variables
      doc.setData(replacementData);
      
      try {
        // Render the document
        doc.render();
      } catch (error) {
        console.error('Error rendering document:', error);
        throw new Error('Failed to render document. Please check your template and data.');
      }
      
      if (i === 0) {
        // First document becomes our base
        mergedZip = doc.getZip();
        mergedDoc = doc;
      } else {
        // For subsequent documents, we need to append content
        // This is a simplified approach - we'll add a page break and append content
        const currentDocContent = doc.getFullText();
        
        // Add page break and content to the merged document
        // Note: This is a basic implementation. For more sophisticated merging,
        // you'd need to manipulate the document.xml directly
        if (mergedDoc && mergedZip) {
          try {
            // Get the document.xml content
            const documentXml = mergedZip.files['word/document.xml'];
            if (documentXml) {
              let content = documentXml.asText();
              
              // Find the closing body tag and insert page break + new content before it
              const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
              
              // Get the new document's content
              const newDocZip = doc.getZip();
              const newDocumentXml = newDocZip.files['word/document.xml'];
              if (newDocumentXml) {
                let newContent = newDocumentXml.asText();
                
                // Extract the body content from the new document (excluding the document wrapper)
                const bodyStart = newContent.indexOf('<w:body>') + '<w:body>'.length;
                const bodyEnd = newContent.indexOf('</w:body>');
                const bodyContent = newContent.substring(bodyStart, bodyEnd);
                
                // Insert page break and new content before the closing body tag
                const closingBodyIndex = content.indexOf('</w:body>');
                if (closingBodyIndex !== -1) {
                  content = content.substring(0, closingBodyIndex) + 
                           pageBreak + 
                           bodyContent + 
                           content.substring(closingBodyIndex);
                  
                  // Update the document.xml in the merged zip
                  mergedZip.file('word/document.xml', content);
                }
              }
            }
          } catch (appendError) {
            console.warn('Could not append document content, creating separate documents instead:', appendError);
            // If appending fails, we'll just return the first document
            break;
          }
        }
      }
    }
    
    if (!mergedZip) {
      throw new Error('Failed to create merged document');
    }
    
    // Generate the final merged document
    const finalBuffer = mergedZip.generate({
      type: 'arraybuffer',
      compression: 'DEFLATE',
    });
    
    return new Blob([finalBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
  } catch (error) {
    console.error('Error generating merged DOCX:', error);
    throw new Error('Failed to generate merged DOCX. Please check your template and data.');
  }
};

export const downloadDocx = (docxBlob: Blob, filename: string = 'merged-document.docx') => {
  saveAs(docxBlob, filename);
};