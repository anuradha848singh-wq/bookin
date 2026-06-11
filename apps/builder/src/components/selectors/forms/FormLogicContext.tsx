"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormLogicContextType {
  values: Record<string, any>;
  setValue: (fieldId: string, value: any) => void;
  evaluateRules: (rules?: any[], logic?: "AND" | "OR") => boolean;
}

const FormLogicContext = createContext<FormLogicContextType | undefined>(undefined);

export const FormLogicProvider = ({ children }: { children: ReactNode }) => {
  const [values, setValues] = useState<Record<string, any>>({});

  const setValue = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const evaluateRules = (rules?: any[], logic: "AND" | "OR" = "AND"): boolean => {
    if (!rules || rules.length === 0) return true;

    const evaluateRule = (rule: any) => {
      const targetValue = values[rule.targetId];
      switch (rule.operator) {
        case "equals":
          return String(targetValue) === String(rule.value);
        case "not_equals":
          return String(targetValue) !== String(rule.value);
        case "contains":
          return targetValue && String(targetValue).includes(String(rule.value));
        default:
          return true;
      }
    };

    if (logic === "OR") {
      return rules.some(evaluateRule);
    }
    return rules.every(evaluateRule);
  };

  return (
    <FormLogicContext.Provider value={{ values, setValue, evaluateRules }}>
      {children}
    </FormLogicContext.Provider>
  );
};

export const useFormLogic = () => {
  const context = useContext(FormLogicContext);
  // If not inside a provider, just return a mock so the builder doesn't crash
  if (!context) {
    return {
      values: {},
      setValue: () => {},
      evaluateRules: () => true, // default to visible if no context
    };
  }
  return context;
};
