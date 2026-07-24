export interface DiseasePrediction {
  disease: string;
  confidence: number;
  affectedTeeth: number[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  recommendedTreatment: string[];
  suggestedMedicines: { name: string; dosage: string; duration: string }[];
  homeRemedies: string[];
  specialistRecommendation: string;
}

export interface ScanReport {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  imageUrl: string;
  imageType: 'X-Ray' | 'Intraoral Photo' | 'Panoramic Radiograph';
  predictions: DiseasePrediction[];
  overallSeverity: 'Low' | 'Medium' | 'High' | 'Critical';
  overallConfidence: number;
  status: 'Pending' | 'Completed' | 'Reviewed';
  notes?: string;
  createdAt: string;
}
