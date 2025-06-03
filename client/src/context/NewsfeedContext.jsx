import { createContext, useContext, useState } from "react";

const NewsfeedContext = createContext();

export const NewsfeedProvider = ({ children }) => {
const [news, setNews] = useState([]);

return (
    <NewsfeedContext.Provider value={{ news, setNews }}>
        {children}
    </NewsfeedContext.Provider>
);

};

export const useNewsfeed = () => {
return useContext(NewsfeedContext);
};