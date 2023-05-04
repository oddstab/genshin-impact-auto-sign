import { useState } from "react";

function App() {
  const [crx, setCrx] = useState("create-chrome-ext");

  return (
    <main className="bg-blue-700">
      <h3 className="text-red-50">Popup Page!</h3>

      <h6>v 0.0.0</h6>

      <a href="https://www.npmjs.com/package/create-chrome-ext" target="_blank">
        Power by {crx}
      </a>
    </main>
  );
}

export default App;
