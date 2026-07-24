import { Patient } from '../types/patient';
import { ScanReport } from '../types/scan';
import { Appointment } from '../types/appointment';

export const initialMockPatients: Patient[] = [
  {
    id: 'pat_1',
    fullName: 'Robert Chen',
    age: 42,
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    email: 'robert.chen@example.com',
    address: '742 Evergreen Terrace, Springfield',
    medicalHistory: ['Hypertension', 'Penicillin Allergy'],
    dentalHistory: ['Restoration #14 (2022)', 'Crown #19 (2023)'],
    createdAt: '2026-01-10T10:00:00Z',
    lastVisit: '2026-07-15T14:30:00Z',
    riskLevel: 'Medium',
  },
  {
    id: 'pat_2',
    fullName: 'Elena Rostova',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 876-5432',
    email: 'elena.r@example.com',
    address: '1088 Ocean Drive, Miami, FL',
    medicalHistory: ['None'],
    dentalHistory: ['Orthodontic Braces (2018-2020)'],
    createdAt: '2026-02-14T11:20:00Z',
    lastVisit: '2026-07-20T09:15:00Z',
    riskLevel: 'Low',
  },
  {
    id: 'pat_3',
    fullName: 'David Miller',
    age: 58,
    gender: 'Male',
    phone: '+1 (555) 345-6789',
    email: 'dmiller@example.com',
    address: '450 Pine Avenue, Seattle, WA',
    medicalHistory: ['Type 2 Diabetes', 'Osteoarthritis'],
    dentalHistory: ['Periodontal Therapy (2024)', 'Extraction #32 (2021)'],
    createdAt: '2025-11-05T15:45:00Z',
    lastVisit: '2026-07-22T16:00:00Z',
    riskLevel: 'High',
  },
  {
    id: 'pat_4',
    fullName: 'Sophia Martinez',
    age: 34,
    gender: 'Female',
    phone: '+1 (555) 654-3210',
    email: 'sophia.m@example.com',
    address: '1200 Market St, San Francisco, CA',
    medicalHistory: ['Asthma'],
    dentalHistory: ['Routine Cleaning (2025)'],
    createdAt: '2026-03-01T08:00:00Z',
    lastVisit: '2026-07-24T10:00:00Z',
    riskLevel: 'Low',
  }
];

export const initialMockScans: ScanReport[] = [
  {
    id: 'scan_101',
    patientId: 'pat_1',
    patientName: 'Robert Chen',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    imageType: 'X-Ray',
    overallSeverity: 'High',
    overallConfidence: 94,
    status: 'Completed',
    notes: 'Severe periapical radiolucency noted around Tooth #19 root apex.',
    createdAt: '2026-07-22T11:30:00Z',
    predictions: [
      {
        disease: 'Periapical Periodontitis & Bone Loss',
        confidence: 94,
        affectedTeeth: [19],
        severity: 'High',
        description: 'Well-defined radiolucent lesion surrounding root apex with localized horizontal alveolar bone resorption.',
        recommendedTreatment: [
          'Endodontic Therapy (Root Canal Treatment)',
          'Biomechanical preparation and sodium hypochlorite irrigation',
          'Crown lengthening & full coverage PFM/Zirconia crown'
        ],
        suggestedMedicines: [
          { name: 'Augmentin (Amoxicillin/Clavulanate)', dosage: '625 mg', duration: 'Every 8 hours for 7 days' },
          { name: 'Ketorolac Tromethamine', dosage: '10 mg', duration: 'Every 6 hours as needed for severe pain' }
        ],
        homeRemedies: [
          'Warm salt water rinses (1/2 tsp salt in 200ml warm water 4x daily)',
          'Avoid chewing hard foods on the affected quadrant'
        ],
        specialistRecommendation: 'Endodontist'
      }
    ]
  },
  {
    id: 'scan_102',
    patientId: 'pat_2',
    patientName: 'Elena Rostova',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    imageType: 'Intraoral Photo',
    overallSeverity: 'Low',
    overallConfidence: 96,
    status: 'Completed',
    notes: 'Minor subgingival plaque buildup on mandibular anteriors.',
    createdAt: '2026-07-20T09:15:00Z',
    predictions: [
      {
        disease: 'Subgingival Dental Calculus & Marginal Gingivitis',
        confidence: 96,
        affectedTeeth: [23, 24, 25, 26],
        severity: 'Low',
        description: 'Subgingival plaque and localized gingival redness around lower incisors.',
        recommendedTreatment: [
          'Full-mouth scaling and polishing',
          'Oral hygiene instructions'
        ],
        suggestedMedicines: [
          { name: 'Chlorhexidine 0.12%', dosage: '15 ml', duration: 'Twice daily for 7 days' }
        ],
        homeRemedies: [
          'Daily interdental flossing',
          'Soft-bristled electric toothbrush'
        ],
        specialistRecommendation: 'Periodontist'
      }
    ]
  }
];

export const initialMockAppointments: Appointment[] = [
  {
    id: 'apt_1',
    patientId: 'pat_1',
    patientName: 'Robert Chen',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    date: '2026-07-25',
    time: '10:00 AM',
    type: 'Root Canal Follow-up',
    status: 'Scheduled',
    notes: 'Evaluate symptom relief and start canal obturation.',
    createdAt: '2026-07-22T12:00:00Z',
  },
  {
    id: 'apt_2',
    patientId: 'pat_2',
    patientName: 'Elena Rostova',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    date: '2026-07-25',
    time: '02:30 PM',
    type: 'Routine Hygiene & AI Scan',
    status: 'Scheduled',
    notes: 'Prophylaxis and full mouth radiograph screening.',
    createdAt: '2026-07-20T09:30:00Z',
  },
  {
    id: 'apt_3',
    patientId: 'pat_3',
    patientName: 'David Miller',
    doctorId: 'doc_101',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    date: '2026-07-24',
    time: '11:15 AM',
    type: 'Periodontal Evaluation',
    status: 'Completed',
    notes: 'Deep scaling performed on upper right quadrant.',
    createdAt: '2026-07-18T14:00:00Z',
  }
];
