import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Proposal, ProposalLineItem } from '@/types/proposal';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/pdf-formatting';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
});

Font.register({
  family: 'Inter-Bold',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
  fontWeight: 'bold',
});

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 20,
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  companyTagline: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  companyDetails: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  proposalSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  proposalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'right',
  },
  proposalDetails: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 12,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 6,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 6,
  },
  text: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    width: '30%',
  },
  gridValue: {
    fontSize: 10,
    color: '#374151',
    width: '70%',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 9,
    flex: 1,
  },
  tableHeaderCell: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  totalRow: {
    backgroundColor: '#fef3c7',
    fontFamily: 'Inter-Bold',
  },
  summaryBox: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#6b7280',
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: '#6b7280',
  },
  termsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderLeft: '4px solid #3b82f6',
  },
  termsTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
});

interface ProposalWithLineItems extends Proposal {
  line_items: ProposalLineItem[];
}

interface ProposalPDFTemplateProps {
  proposal: ProposalWithLineItems;
  companyInfo?: {
    name: string;
    tagline?: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

const ProposalPDFTemplate: React.FC<ProposalPDFTemplateProps> = ({ 
  proposal, 
  companyInfo = {
    name: 'ABC Construction Co.',
    tagline: 'Quality Construction Since 1995',
    address: '123 Main Street, Anytown, ST 12345',
    phone: '(555) 123-4567',
    email: 'info@abcconstruction.com',
    website: 'www.abcconstruction.com',
  }
}) => {
  const calculateSubtotal = () => {
    return proposal.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateTax = (subtotal: number) => {
    // Assuming 8.5% tax rate - this could be configurable
    return subtotal * 0.085;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            {companyInfo.tagline && (
              <Text style={styles.companyTagline}>{companyInfo.tagline}</Text>
            )}
            <Text style={styles.companyDetails}>
              {companyInfo.address}{'\n'}
              Phone: {formatPhoneNumber(companyInfo.phone)}{'\n'}
              Email: {companyInfo.email}{'\n'}
              {companyInfo.website && `Website: ${companyInfo.website}`}
            </Text>
          </View>
          <View style={styles.proposalSection}>
            <Text style={styles.proposalTitle}>Construction Proposal</Text>
            <Text style={styles.proposalDetails}>
              Proposal #: {proposal.id}{'\n'}
              Date: {formatDate(proposal.created_at)}{'\n'}
              Status: {proposal.status}
            </Text>
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Client Name:</Text>
            <Text style={styles.gridValue}>{proposal.client_name}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Address:</Text>
            <Text style={styles.gridValue}>{proposal.client_address}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Phone:</Text>
            <Text style={styles.gridValue}>{formatPhoneNumber(proposal.client_phone || '')}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Email:</Text>
            <Text style={styles.gridValue}>{proposal.client_email}</Text>
          </View>
        </View>

        {/* Project Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Project Type:</Text>
            <Text style={styles.gridValue}>{proposal.project_type}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Project Name:</Text>
            <Text style={styles.gridValue}>{proposal.project_name}</Text>
          </View>
          <View style={styles.grid}>
            <Text style={styles.gridLabel}>Address:</Text>
            <Text style={styles.gridValue}>{proposal.project_address}</Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Description:</Text>
            <Text style={styles.text}>{proposal.project_description}</Text>
          </View>
        </View>

        {/* Scope of Work */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scope of Work</Text>
          <Text style={styles.text}>
            This proposal includes all necessary materials, labor, and equipment required to complete the project as specified. 
            The scope encompasses site preparation, construction activities, quality control measures, and final inspection.
          </Text>
          <Text style={styles.text}>
            All work will be performed in accordance with local building codes and industry best practices. 
            The project will be managed by our experienced team of professionals with regular progress updates provided.
          </Text>
        </View>

        {/* Pricing Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Schedule</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableHeaderCell}>Item</Text>
              <Text style={styles.tableHeaderCell}>Description</Text>
              <Text style={styles.tableHeaderCell}>Quantity</Text>
              <Text style={styles.tableHeaderCell}>Unit Price</Text>
              <Text style={styles.tableHeaderCell}>Total</Text>
            </View>
                          {proposal.line_items.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.description.split(' - ')[0]}</Text>
                  <Text style={styles.tableCell}>{item.description}</Text>
                  <Text style={styles.tableCell}>{item.quantity} {item.unit}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(item.unit_price)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(item.total)}</Text>
                </View>
              ))}
          </View>

          {/* Summary Box */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Pricing Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(calculateSubtotal())}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tax (8.5%):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(calculateTax(calculateSubtotal()))}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(calculateTotal())}</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          <Text style={styles.termsText}>
            • Payment terms: 50% upon contract signing, 50% upon project completion{'\n'}
            • Project timeline is subject to weather conditions and material availability{'\n'}
            • All work is guaranteed for one year from completion date{'\n'}
            • Change orders must be approved in writing before work begins{'\n'}
            • This proposal is valid for 30 days from the date of issue{'\n'}
            • All work will be performed in compliance with local building codes{'\n'}
            • Insurance and licensing information available upon request
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {companyInfo.name} | Licensed & Insured | License #12345 | Insurance #67890
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} of ${totalPages}`
        )} />
      </Page>
    </Document>
  );
};

export default ProposalPDFTemplate; 