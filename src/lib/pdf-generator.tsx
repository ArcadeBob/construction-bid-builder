import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { Proposal, ProposalLineItem } from '@/types/proposal';
import ProposalPDFTemplate from '@/templates/proposal-pdf-template';

interface ProposalWithLineItems extends Proposal {
  line_items: ProposalLineItem[];
}

// PDF Generation Service
export class PDFGenerator {
  static async generateProposalPDF(proposal: ProposalWithLineItems): Promise<Uint8Array> {
    try {
      const blob = await pdf(<ProposalPDFTemplate proposal={proposal} />).toBlob();
      const arrayBuffer = await blob.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async generateProposalPDFAsBlob(proposal: ProposalWithLineItems): Promise<Blob> {
    try {
      return await pdf(<ProposalPDFTemplate proposal={proposal} />).toBlob();
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async generateProposalPDFAsBase64(proposal: ProposalWithLineItems): Promise<string> {
    try {
      const blob = await pdf(<ProposalPDFTemplate proposal={proposal} />).toBlob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      return btoa(String.fromCharCode(...uint8Array));
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async generateProposalPDFWithCompanyInfo(
    proposal: ProposalWithLineItems, 
    companyInfo: {
      name: string;
      tagline?: string;
      address: string;
      phone: string;
      email: string;
      website?: string;
      logo?: string;
    }
  ): Promise<Blob> {
    try {
      return await pdf(<ProposalPDFTemplate proposal={proposal} companyInfo={companyInfo} />).toBlob();
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}

export default PDFGenerator; 