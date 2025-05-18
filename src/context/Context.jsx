// context/Context.jsx
import React, { createContext, useState } from 'react';
import run from "../config/gemini";

// Create Context
const Context = createContext();

// Create a Provider component
const ContextProvider = ({ children }) => {
    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    const delayPara = (index,nextWord) =>{
      setTimeout(function (){
        setResultData(prev=>prev+nextWord);
      },75*index)
    }

    const newChat = () => {
      setLoading(false)
      setShowResult(false)
    }
    
    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt != undefined){
          response = await run(prompt);
          setRecentPrompt(prompt)
        }
        else{
          setPrevPrompts(prev=>[...prev,input])
          setRecentPrompt(input)
          response = await run(input)
        }
        
        let responseArray = response.split("**");
        let newResponse="";
        for(let i = 0; i < responseArray.length; i++)
        {
          if(i === 0 || i%2 !== 1){
            newResponse += responseArray[i];
          }
          else{
            newResponse += "<b>"+responseArray[i]+"</b>";
          }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i = 0; i < newResponseArray.length; i++){
          const nextWord = newResponseArray[i];
          delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }

  return (
    <Context.Provider
      value={{
        onSent,
        recentPrompt,
        prevPrompts,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        setInput,
        input,
        newChat
      }}
    >
      {children}
    </Context.Provider>
  );
};

// Export default ContextProvider
export default ContextProvider;
// Export Context separately for useContext hook
export { Context };