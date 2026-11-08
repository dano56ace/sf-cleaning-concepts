import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCleaningEstimate, formatPhoneNumberInput } from './estimatorLogic';

test('calculateCleaningEstimate returns valid crew size and pricing for commercial office', () => {
  const result = calculateCleaningEstimate({
    category: 'office',
    sqft: 4000,
    frequency: 'weekly',
    restrooms: 3
  });

  assert.equal(result.recommendedServiceSlug, 'office-cleaning');
  assert.equal(result.estimatedCrewSize, 3);
  assert.equal(result.frequencyDiscountPercent, 20);
  assert.ok(result.estimatedVisitRangeMin >= 135);
  assert.ok(result.estimatedVisitRangeMax > result.estimatedVisitRangeMin);
  assert.ok(result.estimatedHoursMin >= 1.5);
});

test('calculateCleaningEstimate applies higher sterilization rate for medical facilities', () => {
  const officeEst = calculateCleaningEstimate({
    category: 'office',
    sqft: 3000,
    frequency: 'onetime',
    restrooms: 2
  });
  const medicalEst = calculateCleaningEstimate({
    category: 'medical',
    sqft: 3000,
    frequency: 'onetime',
    restrooms: 2
  });

  assert.equal(medicalEst.recommendedServiceSlug, 'medical-office-cleaning');
  assert.ok(medicalEst.estimatedVisitRangeMin > officeEst.estimatedVisitRangeMin);
});

test('formatPhoneNumberInput formats 3, 6, and 10 digit numbers accurately', () => {
  assert.equal(formatPhoneNumberInput('561'), '(561');
  assert.equal(formatPhoneNumberInput('561704'), '(561) 704');
  assert.equal(formatPhoneNumberInput('5617045303'), '(561) 704-5303');
  assert.equal(formatPhoneNumberInput('(561) abc 704-xyz 5303999'), '(561) 704-5303');
});
