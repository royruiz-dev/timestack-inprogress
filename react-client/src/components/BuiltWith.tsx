import "./BuiltWith.css";

import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import nodeLogo from "../assets/nodejs.svg";
import goLogo from "../assets/golang.svg";
import typescriptLogo from "../assets/typescript.svg";

export default function BuiltWith() {
  return (
    <div className="built-with">
      <p>Built with:</p>
      <div className="logos">
        <img src={viteLogo} alt="Vite" className="logo vite" />
        <img src={reactLogo} alt="Reach" className="logo react" />
        <img src={goLogo} alt="Go" className="logo go" />
        <img src={nodeLogo} alt="Node.js" className="logo node" />
        <img src={typescriptLogo} alt="TypeScript" className="logo ts" />
      </div>
    </div>
  );
}
