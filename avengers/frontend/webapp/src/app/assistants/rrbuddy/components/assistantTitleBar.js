import Image from "next/image";


export default function AssistantTitleBar({ name, logoFile, onClick, className }) {
    return (
        <header className={className} onClick={onClick} >
            {logoFile &&
                <Image src={logoFile}
                    alt="Logo"
                    height={50}
                    width={50} />}
            <h2 className="text-3xl font-bold">{name}</h2>
        </header>
    )

}