// components/navigation/Navbar.tsx
import React from 'react';

interface TestProps {
    value: number,
    updateFunction: React.Dispatch<React.SetStateAction<number>>;
}

const Test: React.FC<TestProps> = ({ value, updateFunction }) => {
    console.log("component test ", value )
    return (
        <div>
            test - {value} -- 
            <button onClick={() => updateFunction(prevCount => prevCount + 1)}>increment</button>
        </div>
    );
};

export default Test;
