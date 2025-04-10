/**
 * Process CSV data into address format
 * 
 * @param records - Parsed CSV records
 * @returns Formatted address objects
 */
export function csvUpload(records: any[]) {
  // Normalize column names
  const normalizedRecords = records.map(record => {
    const normalizedRecord: Record<string, any> = {};
    
    // Map different possible column names to standardized ones
    for (const [key, value] of Object.entries(record)) {
      const lowerKey = key.toLowerCase();
      
      if (lowerKey.includes('address') || lowerKey.includes('地址') || lowerKey.includes('位置')) {
        normalizedRecord.address = value;
      } else if (lowerKey.includes('note') || lowerKey.includes('備註') || lowerKey.includes('說明')) {
        normalizedRecord.note = value;
      } else if (lowerKey.includes('start') || lowerKey.includes('起點')) {
        // Convert any truthy values to boolean
        normalizedRecord.isStartPoint = ['true', 'yes', '1', 'y', 'start', '起點'].includes(String(value).toLowerCase());
      } else if (lowerKey.includes('end') || lowerKey.includes('終點')) {
        // Convert any truthy values to boolean
        normalizedRecord.isEndPoint = ['true', 'yes', '1', 'y', 'end', '終點'].includes(String(value).toLowerCase());
      }
    }
    
    return normalizedRecord;
  });
  
  // Filter out records without an address
  const validRecords = normalizedRecords.filter(record => record.address && record.address.trim().length > 0);
  
  // If no start or end points are explicitly marked, set first and last as start/end
  if (!validRecords.some(record => record.isStartPoint)) {
    if (validRecords.length > 0) {
      validRecords[0].isStartPoint = true;
    }
  }
  
  if (!validRecords.some(record => record.isEndPoint)) {
    if (validRecords.length > 1) {
      validRecords[validRecords.length - 1].isEndPoint = true;
    }
  }
  
  return validRecords;
}
