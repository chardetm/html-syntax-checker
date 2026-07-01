import { describe, it, expect } from 'vitest';
import { KNOWN_CSS_PROPERTIES } from '../css/cssData';

describe('CSS Property Coverage Integration Test', () => {
  it('checks that all standard CSS properties from MDN are known by the checker', async () => {
    const url = 'https://raw.githubusercontent.com/mdn/data/main/css/properties.json';
    
    let propertiesData: any;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      propertiesData = await response.json();
    } catch (error) {
      console.warn('Could not fetch CSS properties list from MDN live.', error);
      throw error;
    }

    const missingProperties: string[] = [];

    for (const [propName, propDetails] of Object.entries(propertiesData)) {
      const details = propDetails as any;
      
      // We only care about standard or experimental properties
      if (details.status !== 'standard' && details.status !== 'experimental') {
        continue;
      }

      // Ignore custom property wildcard '--*'
      if (propName === '--*') {
        continue;
      }

      // Ignore vendor-prefixed properties
      if (propName.startsWith('-')) {
        continue;
      }

      // Check if it's in KNOWN_CSS_PROPERTIES
      if (!KNOWN_CSS_PROPERTIES.has(propName.toLowerCase())) {
        missingProperties.push(propName);
      }
    }

    if (missingProperties.length > 0) {
      console.log('Missing standard CSS properties in KNOWN_CSS_PROPERTIES:', JSON.stringify(missingProperties));
    }

    expect(missingProperties).toEqual([]);
  });
});
