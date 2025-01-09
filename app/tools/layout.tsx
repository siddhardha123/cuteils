// tools/layout.tsx
import React from "react";

const ToolsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="m-10">
            {children}
        </div>
    );
};

export default ToolsLayout;
