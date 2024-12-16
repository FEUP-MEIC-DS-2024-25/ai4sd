export function getAccentColor(area) {
    switch (area) {
      case "refact":
        return "#FFE354";
      case "arch":
        return "#2D75D4";
      case "verif":
        return "#A74DE3";
      case "req":
        return "#E94646";
      default:
        return "#212121";
    }
  }

export function getShadowColor(area) {
    switch (area) {
      case "arch":
        return "rgba(84, 183, 255, 0.5)";
      case "refact":
        return "rgba(255,227,84, 0.5)";
      case "verif":
        return "rgba(167,77,227, 0.5)";
      case "req":
        return "rgba(233,70,70, 0.5)";
      default:
        return "#C4C4C4";
    }
  }

  export const assistantFilters = {
    RRBuddy: {
        Functional: false,
        NonFunctional: {
            Performance: false,
            Scalability: false,
            Portability: false,
            Compatibility: false,
            Reliability: false,
            Maintainability: false,
            Availability: false,
            Security: false,
            Usability: false
        },
    },
    AssistantName: {
        filter_to_define_1: false,
        filter_to_define_2: false,
        filter_to_define_3: false,
        nested_filter_1: {
          nested_filter_2: {
            filter_to_define_4: false,
            filter_to_define_5: false,
            filter_to_define_5: false
          }
        }
    },
};

export function setAssistantFilters(assistName, updatedFilters) {
  assistantFilters[assistName] = updatedFilters;
}

export function getAssistantFilters(assistName) {
    return assistantFilters[assistName];
}

export function getAssistantSelectedFilters(assistName) {
  const filters = assistantFilters[assistName];
  if (!filters) return [];

  /**
   * Recursively extracts filter keys set to true from a nested filter object.
   * @param {Object} filters - The filters object to search.
   * @param {string} parentKey - The parent key to track nested keys.
   * @returns {Array} - List of filter names that are set to true.
   */
  function getTrueFilters(filters, parentKey = '') {
      let result = [];

      for (const [key, value] of Object.entries(filters)) {
          const fullKey = parentKey ? `${parentKey}.${key}` : key;

          if (typeof value === "boolean" && value === true) {
              result.push(fullKey);
          } else if (typeof value === "object" && value !== null) {
              result = result.concat(getTrueFilters(value, fullKey));
          }
      }

      return result;
  }

  return getTrueFilters(filters);
}
