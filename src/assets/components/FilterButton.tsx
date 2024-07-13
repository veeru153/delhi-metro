export default function FilterButton({ isActive, setActive, label }: FilterButtonProps) {
    const classes = [
        "flex flex-1 justify-center items-center rounded-lg cursor-pointer bg-gray-200 px-2 py-3 transition-colors ease-out",
        isActive ? "bg-red-200" : "bg-gray-200"
    ].join(" ")
    return <>
        <div className={classes} onClick={() => setActive()}>
            <p>{label}</p>
        </div>
    </>
}

interface FilterButtonProps {
    label: string,
    isActive: boolean,
    setActive: Function
}