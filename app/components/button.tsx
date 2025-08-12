"use client";

type ButtonProps = {
    label: string;
    onClick: () => void;
};

export default function Button({ label, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                color: '#FAD1E8',
                backgroundColor: '#bdbdbdff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }}
        >
            {label}
        </button>
    );
}
