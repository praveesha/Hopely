import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  title,
  subtitle,
  headerActions,
  className = "",
  padding = "md",
  shadow = "sm",
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={`bg-white rounded-lg border ${shadowClasses[shadow]} ${className}`}
    >
      {(title || subtitle || headerActions) && (
        <div
          className={`border-b ${paddingClasses[padding]} ${
            padding === "none" ? "p-6" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center space-x-2">{headerActions}</div>
            )}
          </div>
        </div>
      )}
      <div className={padding !== "none" ? paddingClasses[padding] : ""}>
        {children}
      </div>
    </div>
  );
}
