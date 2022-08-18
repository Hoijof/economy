import React from 'react';

import {
  Typography,
  Card,
  CardContent,
  IconButton
  // @ts-ignore
} from "@mui/material";

export const ProviderContext = React.createContext(null);

// @ts-ignore
import { useCallback } from 'react';

export function PopupProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState(null);
  
  const open = useCallback((newContent) => {
    setIsOpen(true);
    setContent(newContent);
  } , []);

  const close = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  } , []);

  return (
    <ProviderContext.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <Card sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "500px",
          overflowY: "auto",
          overflowX: "hidden",
          borderRadius: "8px",
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
          backgroundColor: "white",
          zIndex: 1000,
          animation: "fadeIn 1.2s ease-in-out",
        }}>
          <CardContent>
            {content}
          </CardContent>
        </Card>
      )}
    </ProviderContext.Provider>
  )
}