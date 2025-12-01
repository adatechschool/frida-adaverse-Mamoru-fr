'use client';

import { createContext, useContext, useState, ReactNode } from "react";

type PromotionFilterContextType = {
  selectedPromotion: number | null;
  setSelectedPromotion: (id: number | null) => void;
};

const PromotionFilterContext = createContext<PromotionFilterContextType | undefined>(undefined);

export function PromotionFilterProvider({ children }: { children: ReactNode }) {
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(null);

  return (
    <PromotionFilterContext.Provider value={{ selectedPromotion, setSelectedPromotion }}>
      {children}
    </PromotionFilterContext.Provider>
  );
}

export function usePromotionFilter() {
  const context = useContext(PromotionFilterContext);
  if (context === undefined) {
    throw new Error('usePromotionFilter must be used within a PromotionFilterProvider');
  }
  return context;
}
