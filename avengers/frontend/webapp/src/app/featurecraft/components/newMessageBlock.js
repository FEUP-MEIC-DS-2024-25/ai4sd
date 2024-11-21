import styles from "@/app/page.module.css";

export default function NewMessageBlock() {
    return(
        <div className="flex flex-col justify-end h-full items-center">
            <div className="min-h-20 w-full flex justify-center p-3 relative">
                <div className="w-full flex">
                    <textarea
                        className="flex-grow p-2 border border-gray-300 rounded resize-none overflow-hidden min-h-16 max-h-40 pr-10 mr-2"
                        placeholder="Type your message here..."
                        rows="1"
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                    />
                    <button className="w-16 flex justify-center items-center border bg-[#6C757D] rounded">
                        <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 13V1m0 0L1 5m4-4 4 4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}