const jsPDF = require('jspdf');

const generatePortfolioPDF = async (student, activities) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Digital Portfolio', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Student Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${student.first_name} ${student.last_name}`, 20, yPosition);
  yPosition += 7;
  
  if (student.student_id) {
    doc.text(`Student ID: ${student.student_id}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (student.department) {
    doc.text(`Department: ${student.department}`, 20, yPosition);
    yPosition += 7;
  }
  
  if (student.year_of_study) {
    doc.text(`Year of Study: ${student.year_of_study}`, 20, yPosition);
    yPosition += 7;
  }

  yPosition += 10;

  // Activities Section
  if (activities.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Verified Achievements', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    activities.forEach((activity, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      // Activity title
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${activity.title}`, 20, yPosition);
      yPosition += 7;

      // Activity details
      doc.setFont('helvetica', 'normal');
      doc.text(`Type: ${activity.type}`, 30, yPosition);
      yPosition += 6;

      // Description (split into multiple lines if too long)
      const description = activity.description;
      const maxWidth = pageWidth - 50;
      const splitDescription = doc.splitTextToSize(description, maxWidth);
      doc.text(splitDescription, 30, yPosition);
      yPosition += splitDescription.length * 5 + 5;

      // Date
      const activityDate = new Date(activity.created_at).toLocaleDateString();
      doc.text(`Submitted: ${activityDate}`, 30, yPosition);
      yPosition += 6;

      // Reviewed date
      if (activity.reviewed_at) {
        const reviewedDate = new Date(activity.reviewed_at).toLocaleDateString();
        doc.text(`Verified: ${reviewedDate}`, 30, yPosition);
        yPosition += 6;
      }

      yPosition += 10;
    });
  } else {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text('No verified achievements yet.', 20, yPosition);
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10, { align: 'right' });
  }

  return doc.output('arraybuffer');
};

module.exports = {
  generatePortfolioPDF
};