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