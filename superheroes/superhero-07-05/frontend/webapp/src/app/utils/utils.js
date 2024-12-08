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