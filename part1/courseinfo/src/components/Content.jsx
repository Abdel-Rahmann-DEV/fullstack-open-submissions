import React from "react";
import Part from "./Part";
function Content({ parts }) {
   return (
      <div>
         <Part element={parts[0]} />
         <Part element={parts[1]} />
         <Part element={parts[2]} />
      </div>
   );
}

export default Content;
