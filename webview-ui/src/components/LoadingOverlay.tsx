import React from "react";
import "../css/loading-overlay.css"
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

const LoadingOverlay: React.FC = () => {
    return (
        <div className="loading-overlay">
            <VSCodeProgressRing></VSCodeProgressRing>
        </div>
    );
};

export default LoadingOverlay;
