const XLSX = require('xlsx');

const generateCSVReport = (data, type) => {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};

const generateExcelReport = async (data, type) => {
  if (!data || data.length === 0) {
    // Create empty workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([['No data available']]);
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Auto-size columns
  const colWidths = [];
  const range = XLSX.utils.decode_range(ws['!ref']);
  
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (cell && cell.v) {
        const cellLength = cell.v.toString().length;
        maxWidth = Math.max(maxWidth, cellLength);
      }
    }
    colWidths.push({ wch: Math.min(maxWidth, 50) }); // Cap at 50 characters
  }
  
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  const sheetName = type === 'students' ? 'Students Report' : 'Activities Report';
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Add summary sheet
  const summaryData = generateSummaryData(data, type);
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

const generateSummaryData = (data, type) => {
  const summary = [];
  
  summary.push(['Report Type', type === 'students' ? 'Students Report' : 'Activities Report']);
  summary.push(['Generated Date', new Date().toLocaleDateString()]);
  summary.push(['Total Records', data.length]);
  summary.push(['']);
  
  if (type === 'students') {
    const totalActivities = data.reduce((sum, student) => sum + (student.total_activities || 0), 0);
    const approvedActivities = data.reduce((sum, student) => sum + (student.approved_activities || 0), 0);
    const pendingActivities = data.reduce((sum, student) => sum + (student.pending_activities || 0), 0);
    const rejectedActivities = data.reduce((sum, student) => sum + (student.rejected_activities || 0), 0);
    
    summary.push(['Total Activities', totalActivities]);
    summary.push(['Approved Activities', approvedActivities]);
    summary.push(['Pending Activities', pendingActivities]);
    summary.push(['Rejected Activities', rejectedActivities]);
    
    if (totalActivities > 0) {
      summary.push(['Approval Rate', `${((approvedActivities / totalActivities) * 100).toFixed(2)}%`]);
    }
  } else if (type === 'activities') {
    const statusCounts = data.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      summary.push([`${status.charAt(0).toUpperCase() + status.slice(1)} Activities`, count]);
    });
    
    const typeCounts = data.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});
    
    summary.push(['']);
    summary.push(['Activity Types:', '']);
    Object.entries(typeCounts).forEach(([type, count]) => {
      summary.push([type, count]);
    });
  }
  
  return summary;
};

module.exports = {
  generateCSVReport,
  generateExcelReport
};