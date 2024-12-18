"use client"

import { getAccentColor } from "@/app/utils/utils";

export default function AssistantButton(props) {
    function click(event) {
        var area = event.target.classList[1],
            btn = event.target;

         //TODO: filtering happens here.

        if (!btn.classList.contains("selected")) {
            btn.style.backgroundColor = getAccentColor(area)
            btn.style.color = getAccentColor("")
            btn.classList.add("selected")
        } else {
            btn.style.backgroundColor = getAccentColor("")
            btn.style.color = getAccentColor(area)
            btn.classList.remove("selected")
        }
    }

    return (
        <button className={"filter-assistant-button " + props.area} onClick={click} style={{border: "1px solid #C4C4C4", backgroundColor: "#212121", display: "grid", fontWeight: "w800", justifyContent: "center", alignContent: "center", borderRadius: "25px", fontSize: "24px", borderColor: "transparent", color: getAccentColor(props.area)}}>
            {getButtonText(props.area)}
        </button>)
}

function getButtonText(area) {
    switch (area) {
        case "arch":
            return "A&D";
        case "refact":
            return "C&R";
        case "verif":
            return "V&V";
        case "req":
            return "RE";
    }
}