export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const generateId = (): string => {
  return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const getMaterialTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    plan: '施工方案',
    calculation: '计算书',
    drawing: '图纸',
    review: '审查意见',
    rectification: '整改方案'
  };
  return typeMap[type] || type;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#ff7d00',
    reviewing: '#165dff',
    pass: '#00b42a',
    modify: '#722ed1',
    reject: '#f53f3f'
  };
  return colorMap[status] || '#86909c';
};

export const getSeverityColor = (severity: string): string => {
  const colorMap: Record<string, string> = {
    light: '#86909c',
    medium: '#ff7d00',
    serious: '#f53f3f'
  };
  return colorMap[severity] || '#86909c';
};

export const getDangerCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    deep: '#165dff',
    high: '#722ed1',
    large: '#0fc6c2'
  };
  return colorMap[category] || '#165dff';
};
