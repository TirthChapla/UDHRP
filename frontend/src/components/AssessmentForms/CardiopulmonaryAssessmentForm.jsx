import React from 'react';

export const defaultCardiopulmonaryAssessment = {
  patientName: '',
  patientAge: '',
  patientGender: '',
  patientAddress: '',
  patientOccupation: '',
  patientHeight: '',
  patientWeight: '',
  patientBmi: '',
  patientOpdIpdNo: '',
  assessmentDate: '',
  admissionDate: '',
  referringDoctor: '',
  diagnosis: '',
  chiefComplaints: '',
  historyOnset: '',
  historyMode: '',
  historyProgression: '',
  historyAggravating: '',
  historyRelieving: '',
  historyDiurnal: '',
  pastMedical: '',
  pastSurgical: '',
  pastPhysio: '',
  pastMedications: '',
  pastFamily: '',
  socialDiet: '',
  socialSleep: '',
  socialBowelBladder: '',
  socialAddiction: '',
  socialFunctionalIndependence: '',
  observationPosture: '',
  observationGait: '',
  observationAssistiveDevices: '',
  vitalPulse: '',
  vitalBloodPressure: '',
  vitalRespiratoryRate: '',
  vitalSpo2: '',
  vitalTemperature: '',
  cardioChestExpansion: '',
  cardioBreathSounds: '',
  cardioDyspnoeaGrade: '',
  cardioCoughSputum: '',
  cardioExerciseTolerance: '',
  cardioFunctionalCapacity: '',
  functionalBedMobility: '',
  functionalTransfers: '',
  functionalAdls: '',
  problemImpairments: '',
  problemActivityLimitations: '',
  problemParticipationRestrictions: '',
  physiotherapyDiagnosis: '',
  goalsShortTerm: '',
  goalsLongTerm: '',
  treatmentElectrotherapy: '',
  treatmentExerciseTherapy: '',
  treatmentCardiopulmonaryRehab: '',
  treatmentHomeExercise: '',
  outcomeMeasures: '',
  reassessmentNotes: '',
  physiotherapistSignature: '',
  reassessmentDate: ''
};

function CardiopulmonaryAssessmentForm({ value, onChange }) {
  const assessment = { ...defaultCardiopulmonaryAssessment, ...(value || {}) };

  const handleChange = (field, nextValue) => {
    if (typeof onChange === 'function') {
      onChange({
        ...assessment,
        [field]: nextValue
      });
    }
  };

  return (
    <div className="assessment-block">
      <div className="section-title">
        <h3>Cardiopulmonary Physiotherapy Assessment</h3>
      </div>

      <h4 className="assessment-heading">Patient Identification Details</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={assessment.patientName}
            onChange={(e) => handleChange('patientName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="text"
            value={assessment.patientAge}
            onChange={(e) => handleChange('patientAge', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <input
            type="text"
            value={assessment.patientGender}
            onChange={(e) => handleChange('patientGender', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={assessment.patientAddress}
            onChange={(e) => handleChange('patientAddress', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Occupation</label>
          <input
            type="text"
            value={assessment.patientOccupation}
            onChange={(e) => handleChange('patientOccupation', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input
            type="text"
            value={assessment.patientHeight}
            onChange={(e) => handleChange('patientHeight', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Weight</label>
          <input
            type="text"
            value={assessment.patientWeight}
            onChange={(e) => handleChange('patientWeight', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>BMI</label>
          <input
            type="text"
            value={assessment.patientBmi}
            onChange={(e) => handleChange('patientBmi', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>OPD / IPD No.</label>
          <input
            type="text"
            value={assessment.patientOpdIpdNo}
            onChange={(e) => handleChange('patientOpdIpdNo', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date of Assessment</label>
          <input
            type="date"
            value={assessment.assessmentDate}
            onChange={(e) => handleChange('assessmentDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date of Admission</label>
          <input
            type="date"
            value={assessment.admissionDate}
            onChange={(e) => handleChange('admissionDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Referring Doctor</label>
          <input
            type="text"
            value={assessment.referringDoctor}
            onChange={(e) => handleChange('referringDoctor', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Diagnosis</label>
          <input
            type="text"
            value={assessment.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Chief Complaints (Patient's Words)</label>
        <textarea
          rows={2}
          value={assessment.chiefComplaints}
          onChange={(e) => handleChange('chiefComplaints', e.target.value)}
        />
      </div>

      <h4 className="assessment-heading">History of Present Illness</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Onset (sudden / gradual)</label>
          <input
            type="text"
            value={assessment.historyOnset}
            onChange={(e) => handleChange('historyOnset', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mode of onset</label>
          <input
            type="text"
            value={assessment.historyMode}
            onChange={(e) => handleChange('historyMode', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Progression of symptoms</label>
          <input
            type="text"
            value={assessment.historyProgression}
            onChange={(e) => handleChange('historyProgression', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Aggravating factors</label>
          <input
            type="text"
            value={assessment.historyAggravating}
            onChange={(e) => handleChange('historyAggravating', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Relieving factors</label>
          <input
            type="text"
            value={assessment.historyRelieving}
            onChange={(e) => handleChange('historyRelieving', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Diurnal variation</label>
          <input
            type="text"
            value={assessment.historyDiurnal}
            onChange={(e) => handleChange('historyDiurnal', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Past History</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Medical history</label>
          <input
            type="text"
            value={assessment.pastMedical}
            onChange={(e) => handleChange('pastMedical', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Surgical history</label>
          <input
            type="text"
            value={assessment.pastSurgical}
            onChange={(e) => handleChange('pastSurgical', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Previous physiotherapy treatment</label>
          <input
            type="text"
            value={assessment.pastPhysio}
            onChange={(e) => handleChange('pastPhysio', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Medications</label>
          <input
            type="text"
            value={assessment.pastMedications}
            onChange={(e) => handleChange('pastMedications', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Family history</label>
          <input
            type="text"
            value={assessment.pastFamily}
            onChange={(e) => handleChange('pastFamily', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Personal / Social History</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Diet</label>
          <input
            type="text"
            value={assessment.socialDiet}
            onChange={(e) => handleChange('socialDiet', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Sleep</label>
          <input
            type="text"
            value={assessment.socialSleep}
            onChange={(e) => handleChange('socialSleep', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Bowel & bladder</label>
          <input
            type="text"
            value={assessment.socialBowelBladder}
            onChange={(e) => handleChange('socialBowelBladder', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Addiction (if any)</label>
          <input
            type="text"
            value={assessment.socialAddiction}
            onChange={(e) => handleChange('socialAddiction', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Functional independence level</label>
          <input
            type="text"
            value={assessment.socialFunctionalIndependence}
            onChange={(e) => handleChange('socialFunctionalIndependence', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Observation</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Posture</label>
          <input
            type="text"
            value={assessment.observationPosture}
            onChange={(e) => handleChange('observationPosture', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Gait / functional posture</label>
          <input
            type="text"
            value={assessment.observationGait}
            onChange={(e) => handleChange('observationGait', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Assistive devices</label>
          <input
            type="text"
            value={assessment.observationAssistiveDevices}
            onChange={(e) => handleChange('observationAssistiveDevices', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Vital Parameters</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Pulse</label>
          <input
            type="text"
            value={assessment.vitalPulse}
            onChange={(e) => handleChange('vitalPulse', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Blood Pressure</label>
          <input
            type="text"
            value={assessment.vitalBloodPressure}
            onChange={(e) => handleChange('vitalBloodPressure', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Respiratory Rate</label>
          <input
            type="text"
            value={assessment.vitalRespiratoryRate}
            onChange={(e) => handleChange('vitalRespiratoryRate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>SpO2</label>
          <input
            type="text"
            value={assessment.vitalSpo2}
            onChange={(e) => handleChange('vitalSpo2', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Temperature</label>
          <input
            type="text"
            value={assessment.vitalTemperature}
            onChange={(e) => handleChange('vitalTemperature', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Cardiopulmonary Assessment</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Chest expansion</label>
          <input
            type="text"
            value={assessment.cardioChestExpansion}
            onChange={(e) => handleChange('cardioChestExpansion', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Breath sounds</label>
          <input
            type="text"
            value={assessment.cardioBreathSounds}
            onChange={(e) => handleChange('cardioBreathSounds', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Dyspnoea grade</label>
          <input
            type="text"
            value={assessment.cardioDyspnoeaGrade}
            onChange={(e) => handleChange('cardioDyspnoeaGrade', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Cough & sputum</label>
          <input
            type="text"
            value={assessment.cardioCoughSputum}
            onChange={(e) => handleChange('cardioCoughSputum', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Exercise tolerance</label>
          <input
            type="text"
            value={assessment.cardioExerciseTolerance}
            onChange={(e) => handleChange('cardioExerciseTolerance', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Functional capacity (6MWT / METs)</label>
          <input
            type="text"
            value={assessment.cardioFunctionalCapacity}
            onChange={(e) => handleChange('cardioFunctionalCapacity', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Functional Assessment</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Bed mobility</label>
          <input
            type="text"
            value={assessment.functionalBedMobility}
            onChange={(e) => handleChange('functionalBedMobility', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Transfers</label>
          <input
            type="text"
            value={assessment.functionalTransfers}
            onChange={(e) => handleChange('functionalTransfers', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>ADLs</label>
          <input
            type="text"
            value={assessment.functionalAdls}
            onChange={(e) => handleChange('functionalAdls', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Problem List</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Impairments</label>
          <input
            type="text"
            value={assessment.problemImpairments}
            onChange={(e) => handleChange('problemImpairments', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Activity limitations</label>
          <input
            type="text"
            value={assessment.problemActivityLimitations}
            onChange={(e) => handleChange('problemActivityLimitations', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Participation restrictions</label>
          <input
            type="text"
            value={assessment.problemParticipationRestrictions}
            onChange={(e) => handleChange('problemParticipationRestrictions', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Physiotherapy Diagnosis</label>
        <input
          type="text"
          value={assessment.physiotherapyDiagnosis}
          onChange={(e) => handleChange('physiotherapyDiagnosis', e.target.value)}
        />
      </div>

      <h4 className="assessment-heading">Goals</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Short Term Goals</label>
          <input
            type="text"
            value={assessment.goalsShortTerm}
            onChange={(e) => handleChange('goalsShortTerm', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Long Term Goals</label>
          <input
            type="text"
            value={assessment.goalsLongTerm}
            onChange={(e) => handleChange('goalsLongTerm', e.target.value)}
          />
        </div>
      </div>

      <h4 className="assessment-heading">Treatment Plan</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Electrotherapy</label>
          <input
            type="text"
            value={assessment.treatmentElectrotherapy}
            onChange={(e) => handleChange('treatmentElectrotherapy', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Exercise therapy</label>
          <input
            type="text"
            value={assessment.treatmentExerciseTherapy}
            onChange={(e) => handleChange('treatmentExerciseTherapy', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Cardiopulmonary rehabilitation</label>
          <input
            type="text"
            value={assessment.treatmentCardiopulmonaryRehab}
            onChange={(e) => handleChange('treatmentCardiopulmonaryRehab', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Home exercise program</label>
          <input
            type="text"
            value={assessment.treatmentHomeExercise}
            onChange={(e) => handleChange('treatmentHomeExercise', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Outcome Measures (6MWT / METs)</label>
        <input
          type="text"
          value={assessment.outcomeMeasures}
          onChange={(e) => handleChange('outcomeMeasures', e.target.value)}
        />
      </div>

      <h4 className="assessment-heading">Reassessment & Progress Notes</h4>
      <div className="assessment-grid">
        <div className="form-group">
          <label>Physiotherapist's Name & Signature</label>
          <input
            type="text"
            value={assessment.physiotherapistSignature}
            onChange={(e) => handleChange('physiotherapistSignature', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={assessment.reassessmentDate}
            onChange={(e) => handleChange('reassessmentDate', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea
          rows={2}
          value={assessment.reassessmentNotes}
          onChange={(e) => handleChange('reassessmentNotes', e.target.value)}
        />
      </div>
    </div>
  );
}

export default CardiopulmonaryAssessmentForm;
