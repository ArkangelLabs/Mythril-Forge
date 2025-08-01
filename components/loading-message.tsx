import React from "react";
import AITextLoading from "./kokonutui/ai-text-loading";
import usePromptStore from "@/stores/usePromptStore";

const LoadingMessage: React.FC = () => {
  const { loadingMessages, themeColor } = usePromptStore();
  
  return (
    <div className="text-sm">
      <div className="flex flex-col">
        <div className="flex">
          <div className="mr-4 rounded-[16px] px-4 py-2 md:mr-24 text-black font-light" style={{ backgroundColor: 'white' }}>
            <AITextLoading 
              texts={loadingMessages} 
              className="text-sm"
              interval={2000}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
