"use client";
import React, { useMemo } from "react";
import { Progress } from "./ui/progress";

const CalculatePasswordStrength = ({ password }: { password: string }) => {
  const value = useMemo(() => {
    const length = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[\W_]/.test(password);
    const result = [
      length,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialCharacter,
    ];
    return result.filter((v) => v).length / result.length;
  }, [password]);

  return (
    <div className="py-2">
      <Progress value={value * 100} />
    </div>
  );
};

export default CalculatePasswordStrength;
